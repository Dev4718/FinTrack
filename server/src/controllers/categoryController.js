import { z } from 'zod';
import prisma from '../config/db.js';

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  type: z.enum(['Expense', 'Income']),
  icon: z.string().default('Tag'),
  color: z.string().default('#10b981'),
  description: z.string().optional().nullable()
});

export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { userId: req.user.id },
          { userId: null, isDefault: true }
        ]
      },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }]
    });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, type, icon, color, description } = req.body;

    const existing = await prisma.category.findFirst({
      where: {
        userId: req.user.id,
        name: { equals: name, mode: 'insensitive' }
      }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A category with this name already exists in your account.'
      });
    }

    const category = await prisma.category.create({
      data: {
        userId: req.user.id,
        name,
        type,
        icon: icon || 'Tag',
        color: color || '#10b981',
        description,
        isDefault: false
      }
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found or cannot delete default system category.'
      });
    }

    await prisma.category.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
