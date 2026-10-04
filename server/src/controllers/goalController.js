import { z } from 'zod';
import prisma from '../config/db.js';

export const goalSchema = z.object({
  title: z.string().min(1, 'Goal title is required'),
  targetAmount: z.number().positive('Target amount must be positive'),
  currentAmount: z.number().nonnegative().optional().default(0),
  targetDate: z.string().min(1, 'Target date is required'),
  category: z.string().optional().default('General'),
  color: z.string().optional().default('#10b981'),
  icon: z.string().optional().default('Target')
});

export const getGoals = async (req, res, next) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = goals.map(g => ({
      id: g.id,
      title: g.title,
      targetAmount: Number(g.targetAmount),
      currentAmount: Number(g.currentAmount),
      progressPercentage: g.targetAmount > 0 
        ? Math.min(100, Math.round((Number(g.currentAmount) / Number(g.targetAmount)) * 100)) 
        : 0,
      targetDate: g.targetDate,
      category: g.category,
      color: g.color,
      icon: g.icon
    }));

    res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (req, res, next) => {
  try {
    const { title, targetAmount, currentAmount, targetDate, category, color, icon } = req.body;

    const goal = await prisma.goal.create({
      data: {
        userId: req.user.id,
        title,
        targetAmount,
        currentAmount: currentAmount || 0,
        targetDate,
        category: category || 'General',
        color: color || '#10b981',
        icon: icon || 'Target'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Financial goal created.',
      data: {
        id: goal.id,
        title: goal.title,
        targetAmount: Number(goal.targetAmount),
        currentAmount: Number(goal.currentAmount),
        targetDate: goal.targetDate,
        category: goal.category,
        color: goal.color,
        icon: goal.icon
      }
    });
  } catch (error) {
    next(error);
  }
};

export const contributeGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Contribution amount must be greater than zero.'
      });
    }

    const goal = await prisma.goal.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found.'
      });
    }

    const updated = await prisma.goal.update({
      where: { id },
      data: {
        currentAmount: { increment: amount }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully.',
      data: {
        id: updated.id,
        title: updated.title,
        targetAmount: Number(updated.targetAmount),
        currentAmount: Number(updated.currentAmount),
        progressPercentage: Math.min(100, Math.round((Number(updated.currentAmount) / Number(updated.targetAmount)) * 100))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.goal.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found.'
      });
    }

    await prisma.goal.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Goal deleted.'
    });
  } catch (error) {
    next(error);
  }
};
