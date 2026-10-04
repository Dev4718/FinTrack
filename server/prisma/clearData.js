import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearAllData() {
  console.log('🗑️  Deleting all rows from Supabase database tables...');

  try {
    const deletedNotifications = await prisma.notification.deleteMany({});
    console.log(`- Cleared notifications: ${deletedNotifications.count} rows deleted`);

    const deletedTransactions = await prisma.transaction.deleteMany({});
    console.log(`- Cleared transactions: ${deletedTransactions.count} rows deleted`);

    const deletedBudgets = await prisma.budget.deleteMany({});
    console.log(`- Cleared budgets: ${deletedBudgets.count} rows deleted`);

    const deletedGoals = await prisma.goal.deleteMany({});
    console.log(`- Cleared goals: ${deletedGoals.count} rows deleted`);

    const deletedAccounts = await prisma.account.deleteMany({});
    console.log(`- Cleared accounts: ${deletedAccounts.count} rows deleted`);

    const deletedCategories = await prisma.category.deleteMany({});
    console.log(`- Cleared categories: ${deletedCategories.count} rows deleted`);

    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`- Cleared users: ${deletedUsers.count} rows deleted`);

    console.log('✅ All database tables are now completely empty and ready for fresh real data!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearAllData();
