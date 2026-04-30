const express = require('express');
const { prisma } = require('../prisma/client');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All expense routes require auth
router.use(verifyToken);

// GET /expenses - list user's expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.userId },
      include: { category: true },
      orderBy: { expenseDate: 'desc' },
    });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// POST /expenses - create expense
router.post('/', async (req, res) => {
  const { title, amount, expenseDate, categoryId, note } = req.body;
  if (!title || !amount || !expenseDate) {
    return res.status(400).json({ error: 'title, amount, expenseDate required' });
  }

  try {
    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount),
        expenseDate: new Date(expenseDate),
        userId: req.userId,
        categoryId: categoryId || null,
        note: note || null,
      },
      include: { category: true },
    });
    res.json(expense);
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
      include: { category: true },
    });

    if (!expense) return res.status(404).json({ error: 'expense not found' });
    if (expense.userId !== req.userId) return res.status(403).json({ error: 'forbidden' });

    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// PUT /expenses/:id - update expense
router.put('/:id', async (req, res) => {
  const { title, amount, expenseDate, categoryId, note } = req.body;

  try {
    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!expense) return res.status(404).json({ error: 'expense not found' });
    if (expense.userId !== req.userId) return res.status(403).json({ error: 'forbidden' });

    const updated = await prisma.expense.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title: title !== undefined ? title : expense.title,
        amount: amount !== undefined ? parseFloat(amount) : expense.amount,
        expenseDate: expenseDate !== undefined ? new Date(expenseDate) : expense.expenseDate,
        categoryId: categoryId !== undefined ? categoryId : expense.categoryId,
        note: note !== undefined ? note : expense.note,
      },
      include: { category: true },
    });

    res.json(updated);
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
