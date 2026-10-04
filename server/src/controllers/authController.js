import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../config/db.js';
import { generateToken } from '../utils/token.js';
import { DEFAULT_CATEGORIES } from '../utils/defaultCategories.js';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  currency: z.string().optional().default('INR')
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required')
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password, currency } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Compute initials
    const initials = name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'FT';

    // Create user along with default account and default categories in a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          passwordHash,
          initials,
          currency: currency || 'INR'
        }
      });

      // Create primary bank account
      await tx.account.create({
        data: {
          userId: user.id,
          name: 'Primary Account',
          type: 'bank',
          balance: 0.0
        }
      });

      // Seed user default categories
      await tx.category.createMany({
        data: DEFAULT_CATEGORIES.map(cat => ({
          ...cat,
          userId: user.id,
          isDefault: true
        }))
      });

      // Create welcome notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: 'Welcome to FinTrack! 🎉',
          message: 'Your account is ready. Start by adding your first transaction or setting up a monthly budget.',
          type: 'celebration'
        }
      });

      return user;
    });

    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        initials: newUser.initials,
        currency: newUser.currency,
        theme: newUser.theme
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        initials: user.initials,
        currency: user.currency,
        theme: user.theme
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, currency, theme } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name ? { name } : {}),
        ...(currency ? { currency } : {}),
        ...(theme ? { theme } : {})
      },
      select: {
        id: true,
        name: true,
        email: true,
        initials: true,
        currency: true,
        theme: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updated
    });
  } catch (error) {
    next(error);
  }
};
