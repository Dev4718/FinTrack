import { z } from 'zod';
import prisma from '../config/db.js';

export const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  limit: z.number().positive('Budget limit must be greater than zero'),
  month: z.string().min(1, 'Month is required'), // e.g. "Sep 2025" or "2026-10"
  alertThreshold: z.number().min(1).max(100).optional().default(80)
});

export const getBudgets = async (req, res, next) => {
  try {
    const { month } = req.query;

    const where = {
      userId: req.user.id
    };

    if (month) {
      where.month = month;
    }

    const budgets = await prisma.budget.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, icon: true, color: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Compute spent amounts dynamically from transactions
    const budgetsWithSpending = await Promise.all(
      budgets.map(async (b) => {
        const spentSum = await prisma.transaction.aggregate({
          where: {
            userId: req.user.id,
            categoryId: b.categoryId,
            type: 'Expense'
          },
          _sum: {
            amount: true
          }
        });

        const spent = Number(spentSum._sum.amount || 0);
        const limit = Number(b.limit);
        const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;

        return {
          id: b.id,
          categoryId: b.categoryId,
          category: b.category?.name || 'Category',
          icon: b.category?.icon || 'Tag',
          color: b.category?.color || '#10b981',
          limit,
          spent,
          remaining: Math.max(0, limit - spent),
          percentage,
          month: b.month,
          alertThreshold: b.alertThreshold,
          isWarning: percentage >= b.alertThreshold && percentage < 100,
          isExceeded: percentage >= 100
        };
      })
    );

    res.status(200).json({
      success: true,
      data: budgetsWithSpending
    });
  } catch (error) {
    next(error);
  }
};

export const upsertBudget = async (req, res, next) => {
  try {
    const { categoryId, limit, month, alertThreshold } = req.body;

    const budget = await prisma.budget.upsert({
      where: {
        userId_categoryId_month: {
          userId: req.user.id,
          categoryId,
          month
        }
      },
      update: {
        limit,
        alertThreshold: alertThreshold || 80
      },
      create: {
        userId: req.user.id,
        categoryId,
        limit,
        month,
        alertThreshold: alertThreshold || 80
      },
      include: {
        category: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Budget saved successfully.',
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.budget.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found.'
      });
    }

    await prisma.budget.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
