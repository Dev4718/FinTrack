import { z } from 'zod';
import prisma from '../config/db.js';

export const transactionSchema = z.object({
  amount: z.number().positive('Amount must be greater than zero'),
  type: z.enum(['Income', 'Expense']),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  accountId: z.string().optional().nullable(),
  date: z.string().or(z.date()).optional(),
  notes: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  categoryColor: z.string().optional().nullable()
});

export const getTransactions = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      type, 
      category, 
      startDate, 
      endDate, 
      search 
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = {
      userId: req.user.id
    };

    if (type && (type === 'Income' || type === 'Expense')) {
      where.type = type;
    }

    if (category) {
      where.OR = [
        { category: { name: { equals: category, mode: 'insensitive' } } },
        { categoryId: category }
      ];
    }

    if (search) {
      where.description = {
        contains: search,
        mode: 'insensitive'
      };
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, icon: true, color: true }
          },
          account: {
            select: { id: true, name: true, type: true }
          }
        },
        orderBy: { date: 'desc' },
        skip,
        take
      }),
      prisma.transaction.count({ where })
    ]);

    // Format response to match frontend expectations
    const formatted = transactions.map(tx => ({
      id: tx.id,
      date: tx.date.toISOString().split('T')[0],
      rawDate: tx.date,
      description: tx.description,
      category: tx.category?.name || 'General',
      categoryId: tx.categoryId,
      type: tx.type,
      amount: Number(tx.amount),
      icon: tx.icon || tx.category?.icon || (tx.type === 'Income' ? 'TrendingUp' : 'Receipt'),
      categoryColor: tx.categoryColor || tx.category?.color || '#64748b',
      notes: tx.notes,
      accountId: tx.accountId,
      accountName: tx.account?.name
    }));

    res.status(200).json({
      success: true,
      data: formatted,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const { 
      amount, 
      type, 
      description, 
      categoryId, 
      category: categoryName,
      accountId, 
      date, 
      notes, 
      icon, 
      categoryColor 
    } = req.body;

    let targetCategoryId = categoryId;

    // If category name provided instead of ID, resolve it
    if (!targetCategoryId && categoryName) {
      const foundCategory = await prisma.category.findFirst({
        where: {
          name: { equals: categoryName, mode: 'insensitive' },
          OR: [{ userId: req.user.id }, { userId: null }]
        }
      });
      if (foundCategory) {
        targetCategoryId = foundCategory.id;
      }
    }

    // Default to user's first account if none provided
    let targetAccountId = accountId;
    if (!targetAccountId) {
      const defaultAccount = await prisma.account.findFirst({
        where: { userId: req.user.id }
      });
      if (defaultAccount) targetAccountId = defaultAccount.id;
    }

    const transaction = await prisma.$transaction(async (tx) => {
      const newTx = await tx.transaction.create({
        data: {
          userId: req.user.id,
          accountId: targetAccountId,
          categoryId: targetCategoryId,
          amount,
          type,
          description,
          date: date ? new Date(date) : new Date(),
          notes,
          icon,
          categoryColor
        },
        include: {
          category: true,
          account: true
        }
      });

      // Update account balance atomically
      if (targetAccountId) {
        const balanceChange = type === 'Income' ? amount : -amount;
        await tx.account.update({
          where: { id: targetAccountId },
          data: {
            balance: {
              increment: balanceChange
            }
          }
        });
      }

      return newTx;
    });

    res.status(201).json({
      success: true,
      message: 'Transaction recorded successfully.',
      data: {
        id: transaction.id,
        date: transaction.date.toISOString().split('T')[0],
        description: transaction.description,
        category: transaction.category?.name || 'General',
        categoryId: transaction.categoryId,
        type: transaction.type,
        amount: Number(transaction.amount),
        icon: transaction.icon || transaction.category?.icon || 'Receipt',
        categoryColor: transaction.categoryColor || transaction.category?.color || '#64748b',
        notes: transaction.notes,
        accountId: transaction.accountId
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, type, description, categoryId, date, notes, icon, categoryColor } = req.body;

    const existingTx = await prisma.transaction.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existingTx) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found.'
      });
    }

    const updatedTx = await prisma.$transaction(async (tx) => {
      // Revert previous account balance impact
      if (existingTx.accountId) {
        const revertDelta = existingTx.type === 'Income' ? -Number(existingTx.amount) : Number(existingTx.amount);
        await tx.account.update({
          where: { id: existingTx.accountId },
          data: { balance: { increment: revertDelta } }
        });
      }

      // Apply updated transaction
      const newTx = await tx.transaction.update({
        where: { id },
        data: {
          ...(amount !== undefined ? { amount } : {}),
          ...(type ? { type } : {}),
          ...(description ? { description } : {}),
          ...(categoryId !== undefined ? { categoryId } : {}),
          ...(date ? { date: new Date(date) } : {}),
          ...(notes !== undefined ? { notes } : {}),
          ...(icon !== undefined ? { icon } : {}),
          ...(categoryColor !== undefined ? { categoryColor } : {})
        },
        include: { category: true }
      });

      // Apply new account balance impact
      if (newTx.accountId) {
        const newDelta = newTx.type === 'Income' ? Number(newTx.amount) : -Number(newTx.amount);
        await tx.account.update({
          where: { id: newTx.accountId },
          data: { balance: { increment: newDelta } }
        });
      }

      return newTx;
    });

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully.',
      data: {
        id: updatedTx.id,
        date: updatedTx.date.toISOString().split('T')[0],
        description: updatedTx.description,
        category: updatedTx.category?.name || 'General',
        categoryId: updatedTx.categoryId,
        type: updatedTx.type,
        amount: Number(updatedTx.amount),
        icon: updatedTx.icon || updatedTx.category?.icon || 'Receipt',
        categoryColor: updatedTx.categoryColor || updatedTx.category?.color || '#64748b',
        notes: updatedTx.notes
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingTx = await prisma.transaction.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existingTx) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found.'
      });
    }

    await prisma.$transaction(async (tx) => {
      // Revert account balance
      if (existingTx.accountId) {
        const revertDelta = existingTx.type === 'Income' ? -Number(existingTx.amount) : Number(existingTx.amount);
        await tx.account.update({
          where: { id: existingTx.accountId },
          data: { balance: { increment: revertDelta } }
        });
      }

      await tx.transaction.delete({
        where: { id }
      });
    });

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const exportTransactionsCsv = async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      include: { category: true, account: true },
      orderBy: { date: 'desc' }
    });

    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Account', 'Notes'];
    const rows = transactions.map(t => [
      t.date.toISOString().split('T')[0],
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${(t.category?.name || 'General').replace(/"/g, '""')}"`,
      t.type,
      Number(t.amount).toFixed(2),
      `"${(t.account?.name || '').replace(/"/g, '""')}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="fintrack_transactions.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
