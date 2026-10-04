import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FinTrack Database Seeding...');

  // Hash demo password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  // 1. Create or upsert Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@fintrack.com' },
    update: {},
    create: {
      email: 'demo@fintrack.com',
      passwordHash,
      name: 'John Doe',
      initials: 'JD',
      currency: 'INR',
      theme: 'light'
    }
  });

  console.log(`👤 Demo user created/verified: ${demoUser.email} (Password: password123)`);

  // 2. Create primary account
  let primaryAccount = await prisma.account.findFirst({
    where: { userId: demoUser.id }
  });

  if (!primaryAccount) {
    primaryAccount = await prisma.account.create({
      data: {
        userId: demoUser.id,
        name: 'HDFC Salary Account',
        type: 'bank',
        balance: 64250.0,
        color: '#3b82f6'
      }
    });
  }

  // 3. Create default categories
  const categoriesData = [
    { name: 'Food', type: 'Expense', icon: 'Utensils', color: '#10b981', description: 'Groceries, dining out, and food orders' },
    { name: 'Transport', type: 'Expense', icon: 'Car', color: '#f59e0b', description: 'Cabs, fuel, metro, and commute' },
    { name: 'Shopping', type: 'Expense', icon: 'ShoppingBag', color: '#8b5cf6', description: 'Clothing, household goods, electronics' },
    { name: 'Bills', type: 'Expense', icon: 'Zap', color: '#ef4444', description: 'Rent, electricity, wifi, and utilities' },
    { name: 'Entertainment', type: 'Expense', icon: 'Film', color: '#ec4899', description: 'Movies, streaming services, events' },
    { name: 'Health', type: 'Expense', icon: 'HeartPulse', color: '#14b8a6', description: 'Doctor visits, medicines, gym membership' },
    { name: 'Salary', type: 'Income', icon: 'Briefcase', color: '#3b82f6', description: 'Primary monthly employment paycheck' },
    { name: 'Freelance', type: 'Income', icon: 'Laptop', color: '#06b6d4', description: 'Consulting, design projects, and side work' },
    { name: 'Investments', type: 'Income', icon: 'TrendingUp', color: '#10b981', description: 'Dividends, mutual funds, interest payouts' }
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    let existing = await prisma.category.findFirst({
      where: { userId: demoUser.id, name: cat.name }
    });
    if (!existing) {
      existing = await prisma.category.create({
        data: {
          ...cat,
          userId: demoUser.id,
          isDefault: true
        }
      });
    }
    categoryMap[cat.name] = existing.id;
  }

  // 4. Create initial demo transactions
  const txCount = await prisma.transaction.count({ where: { userId: demoUser.id } });
  if (txCount === 0) {
    const transactions = [
      { description: 'Swiggy Dinner Order', category: 'Food', type: 'Expense', amount: 580, icon: 'Utensils', categoryColor: '#10b981' },
      { description: 'Monthly Salary Credit', category: 'Salary', type: 'Income', amount: 52000, icon: 'Briefcase', categoryColor: '#3b82f6' },
      { description: 'House Rent Payment', category: 'Bills', type: 'Expense', amount: 18000, icon: 'Home', categoryColor: '#ef4444' },
      { description: 'DMart Monthly Groceries', category: 'Food', type: 'Expense', amount: 4650, icon: 'Utensils', categoryColor: '#10b981' },
      { description: 'Myntra Autumn Apparel', category: 'Shopping', type: 'Expense', amount: 3200, icon: 'ShoppingBag', categoryColor: '#8b5cf6' },
      { description: 'Electricity & Water Bill', category: 'Bills', type: 'Expense', amount: 2100, icon: 'Zap', categoryColor: '#ef4444' },
      { description: 'Freelance UI Design gig', category: 'Freelance', type: 'Income', amount: 9500, icon: 'Laptop', categoryColor: '#06b6d4' },
      { description: 'Uber Commute Pass', category: 'Transport', type: 'Expense', amount: 2400, icon: 'Car', categoryColor: '#f59e0b' },
      { description: 'Cafe Coffee Day Meetup', category: 'Food', type: 'Expense', amount: 450, icon: 'Utensils', categoryColor: '#10b981' },
      { description: 'Netflix & Spotify Family', category: 'Entertainment', type: 'Expense', amount: 899, icon: 'Film', categoryColor: '#ec4899' },
      { description: 'Amazon Electronics & Cable', category: 'Shopping', type: 'Expense', amount: 1100, icon: 'ShoppingBag', categoryColor: '#8b5cf6' }
    ];

    for (let i = 0; i < transactions.length; i++) {
      const item = transactions[i];
      const txDate = new Date();
      txDate.setDate(txDate.getDate() - (i * 2));

      await prisma.transaction.create({
        data: {
          userId: demoUser.id,
          accountId: primaryAccount.id,
          categoryId: categoryMap[item.category] || null,
          amount: item.amount,
          type: item.type,
          description: item.description,
          icon: item.icon,
          categoryColor: item.categoryColor,
          date: txDate
        }
      });
    }
    console.log(`💳 Seeded ${transactions.length} initial transactions`);
  }

  // 5. Create initial budgets
  const budgetCount = await prisma.budget.count({ where: { userId: demoUser.id } });
  if (budgetCount === 0) {
    const budgets = [
      { category: 'Food', limit: 8000, month: 'Current Month', alertThreshold: 80 },
      { category: 'Shopping', limit: 5000, month: 'Current Month', alertThreshold: 80 },
      { category: 'Bills', limit: 22000, month: 'Current Month', alertThreshold: 90 },
      { category: 'Transport', limit: 4000, month: 'Current Month', alertThreshold: 80 },
      { category: 'Entertainment', limit: 2000, month: 'Current Month', alertThreshold: 80 }
    ];

    for (const b of budgets) {
      if (categoryMap[b.category]) {
        await prisma.budget.create({
          data: {
            userId: demoUser.id,
            categoryId: categoryMap[b.category],
            limit: b.limit,
            month: b.month,
            alertThreshold: b.alertThreshold
          }
        });
      }
    }
    console.log(`📊 Seeded initial budgets`);
  }

  // 6. Create initial financial goals
  const goalCount = await prisma.goal.count({ where: { userId: demoUser.id } });
  if (goalCount === 0) {
    const goals = [
      { title: 'Emergency Cushion', targetAmount: 150000, currentAmount: 95000, targetDate: 'Dec 2026', category: 'Safety', color: '#10b981', icon: 'Shield' },
      { title: 'Goa Friends Trip', targetAmount: 35000, currentAmount: 28000, targetDate: 'Nov 2026', category: 'Travel', color: '#06b6d4', icon: 'Plane' },
      { title: 'New Laptop Setup', targetAmount: 85000, currentAmount: 42000, targetDate: 'Jan 2027', category: 'Electronics', color: '#8b5cf6', icon: 'Laptop' },
      { title: 'Festival Celebrations', targetAmount: 20000, currentAmount: 20000, targetDate: 'Oct 2026', category: 'Celebration', color: '#f59e0b', icon: 'Gift' }
    ];

    for (const g of goals) {
      await prisma.goal.create({
        data: {
          ...g,
          userId: demoUser.id
        }
      });
    }
    console.log(`🎯 Seeded initial financial goals`);
  }

  // 7. Seed initial notifications
  const notifCount = await prisma.notification.count({ where: { userId: demoUser.id } });
  if (notifCount === 0) {
    const notifications = [
      { title: 'Heads up on Shopping budget', message: 'Shopping is at 86% of its limit with 5 days left in the month.', type: 'warning' },
      { title: 'Salary credited successfully', message: '₹ 52,000 received from employment paycheck.', type: 'success' },
      { title: 'Goal reached! 🎉', message: 'You achieved 100% of your Festival Celebrations goal.', type: 'celebration', read: true },
      { title: 'Monthly statement ready', message: 'Your spending summary for last month is available to download.', type: 'info', read: true }
    ];

    for (const n of notifications) {
      await prisma.notification.create({
        data: {
          ...n,
          userId: demoUser.id
        }
      });
    }
    console.log(`🔔 Seeded initial notifications`);
  }

  console.log('✅ FinTrack Database Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
