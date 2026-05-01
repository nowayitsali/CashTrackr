const express = require('express');
const { prisma } = require('../prisma/client');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All expense routes require auth
router.use(verifyToken);

async function resolveCategoryId(userId, categoryId, categoryName) {
  if (categoryId !== undefined && categoryId !== null && categoryId !== '') {
    return Number(categoryId);
  }

  const normalizedName = typeof categoryName === 'string' ? categoryName.trim() : '';
  if (!normalizedName) return null;

  const existing = await prisma.category.findFirst({
    where: { userId, name: normalizedName },
  });

  if (existing) return existing.id;

  const created = await prisma.category.create({
    data: { userId, name: normalizedName },
  });

  return created.id;
}

async function attachCategory(expense) {
  if (!expense) return null;

  const category = expense.categoryId
    ? await prisma.category.findFirst({
        where: { id: expense.categoryId, userId: expense.userId },
      })
    : null;

  return {
    ...expense,
    category,
  };
}

// GET /expenses - list user's expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.userId },
      orderBy: { expenseDate: 'desc' },
    });

    const withCategories = await Promise.all(expenses.map((expense) => attachCategory(expense)));
    res.json(withCategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// POST /expenses - create expense
router.post('/', async (req, res) => {
  const { title, amount, expenseDate, categoryId, categoryName, note } = req.body;
  if (!title || !amount || !expenseDate) {
    return res.status(400).json({ error: 'title, amount, expenseDate required' });
  }

  try {
    const resolvedCategoryId = await resolveCategoryId(req.userId, categoryId, categoryName);

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount),
        expenseDate: new Date(expenseDate),
        userId: req.userId,
        categoryId: resolvedCategoryId,
        note: note || null,
      },
    });

    res.json(await attachCategory(expense));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// GET /expenses/:id - get single expense
router.get('/:id', async (req, res) => {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!expense) return res.status(404).json({ error: 'expense not found' });
    if (expense.userId !== req.userId) return res.status(403).json({ error: 'forbidden' });

    res.json(await attachCategory(expense));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// PUT /expenses/:id - update expense
router.put('/:id', async (req, res) => {
  const { title, amount, expenseDate, categoryId, categoryName, note } = req.body;

  try {
    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!expense) return res.status(404).json({ error: 'expense not found' });
    if (expense.userId !== req.userId) return res.status(403).json({ error: 'forbidden' });

    const resolvedCategoryId = await resolveCategoryId(req.userId, categoryId, categoryName);

    const updated = await prisma.expense.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title: title !== undefined ? title : expense.title,
        amount: amount !== undefined ? parseFloat(amount) : expense.amount,
        expenseDate: expenseDate !== undefined ? new Date(expenseDate) : expense.expenseDate,
        categoryId: categoryId !== undefined || categoryName !== undefined ? resolvedCategoryId : expense.categoryId,
        note: note !== undefined ? note : expense.note,
      },
    });

    res.json(await attachCategory(updated));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// DELETE /expenses/:id - delete expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!expense) return res.status(404).json({ error: 'expense not found' });
    if (expense.userId !== req.userId) return res.status(403).json({ error: 'forbidden' });

    await prisma.expense.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'expense deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
