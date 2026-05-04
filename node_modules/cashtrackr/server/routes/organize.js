const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { prisma } = require('../prisma/client');
require('dotenv').config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /organize/suggest - suggest consolidated categories for user's expenses
router.post('/suggest', async (req, res) => {
  try {
    // Fetch user's expenses (category relation not defined in Prisma schema)
    const expenses = await prisma.expense.findMany({
      where: { userId: req.userId },
      orderBy: { expenseDate: 'desc' },
      take: 500,
    });

    // Load user's categories and build id->name map
    const categories = await prisma.category.findMany({ where: { userId: req.userId } });
    const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

    if (expenses.length === 0) {
      return res.json([]);
    }

    // Group by current category
    const byCategory = {};
    for (const expense of expenses) {
      const categoryName = expense.categoryId ? (categoryMap[expense.categoryId] || 'Uncategorized') : 'Uncategorized';
      if (!byCategory[categoryName]) {
        byCategory[categoryName] = [];
      }
      byCategory[categoryName].push(expense);
    }

    // Build summary for Gemini
    const categorySummary = Object.entries(byCategory)
      .map(([name, items]) => {
        const total = items.reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2);
        const examples = items.slice(0, 3).map(e => e.title).join(', ');
        return `- ${name}: ${items.length} items, $${total} (e.g., ${examples}${items.length > 3 ? '...' : ''})`;
      })
      .join('\n');

    const prompt = `Review these expense categories and suggest sensible category names for each existing category. For every current category, return a suggested category name (which may be the same as the original). Only consolidate (map multiple old categories to the same suggested name) when they are genuinely the same concept. IMPORTANT: do NOT consolidate everything into a single category. Prefer preserving distinct categories unless they are clearly similar.

Current categories summary:
${categorySummary}

Return ONLY a JSON object (no markdown) with this exact structure:
{
  "mappings": {
    "OldCategory1": "SuggestedCategory1",
    "OldCategory2": "SuggestedCategory2",
    ...
  },
  "notes": "Optional brief explanation"
}

Examples:
{
  "Dining Out": "Food",
  "Gas": "Transportation",
  "Uber": "Transportation",
  "Coffee": "Coffee"
}

Only include consolidations where appropriate; if categories are already fine, map each old category to itself.`;

    // Choose a model that exists for this API key. Try to list available models and pick a sensible default.
    let modelId = 'gemini-3-flash-preview';
    try {
      const available = await genAI.listModels();
      const names = (available || []).map((m) => m.name || m.model || m.id).filter(Boolean);
      console.log('Available generative models:', names);
      if (names.length > 0) {
        // prefer a gemini model if present
        const prefer = names.find((n) => n.toLowerCase().includes('gemini'));
        modelId = prefer || names[0];
      }
    } catch (e) {
      console.warn('Could not list models, using default model id', e?.message || e);
    }

    console.log('Using generative model:', modelId);
    const model = genAI.getGenerativeModel({ model: modelId });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('Gemini response:', responseText);
      return res.json([]); // Return empty if can't parse
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const mappings = parsed.mappings || {};

    // Build reverse map: suggestedName -> [oldCategory,...]
    const reverse = {};
    for (const [oldCat, suggested] of Object.entries(mappings)) {
      if (!reverse[suggested]) reverse[suggested] = [];
      reverse[suggested].push(oldCat);
    }

    // Transform to frontend format: one group per suggested category
    const groups = Object.entries(reverse).map(([suggestedLabel, oldCats], idx) => {
      const expensesInGroup = [];
      oldCats.forEach(catName => {
        if (byCategory[catName]) expensesInGroup.push(...byCategory[catName]);
      });

      return {
        id: `group_${idx}`,
        currentCategory: oldCats.join(' + '),
        suggestedLabel,
        confidence: 0.85,
        count: expensesInGroup.length,
        examples: expensesInGroup.slice(0, 3).map(e => ({ id: e.id, title: e.title, amount: Number(e.amount).toFixed(2) })),
        itemIds: expensesInGroup.map(e => e.id),
        oldCategories: oldCats,
      };
    });

    res.json(groups);
  } catch (err) {
    console.error('Organize/suggest error:', err);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

// POST /organize/apply - apply chosen consolidated categories
router.post('/apply', async (req, res) => {
  try {
    const { updates } = req.body; // array of { itemIds, newCategory }

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ error: 'updates array required' });
    }

    // Apply updates in transaction
    const results = [];
    await prisma.$transaction(async (tx) => {
      for (const update of updates) {
        if (update.itemIds && update.newCategory && Array.isArray(update.itemIds)) {
          // Find or create category
          let category = await tx.category.findFirst({
            where: { userId: req.userId, name: update.newCategory },
          });

          if (!category) {
            category = await tx.category.create({
              data: { userId: req.userId, name: update.newCategory },
            });
          }

          // Update all expenses in this group
          const result = await tx.expense.updateMany({
            where: { id: { in: update.itemIds }, userId: req.userId },
            data: { categoryId: category.id },
          });

          results.push({
            newCategory: update.newCategory,
            itemCount: result.count,
          });
        }
      }
    });

    res.json({ success: true, updated: results });
  } catch (err) {
    console.error('Organize/apply error:', err.message || err);
    res.status(500).json({ error: 'Failed to apply changes' });
  }
});

module.exports = router;
