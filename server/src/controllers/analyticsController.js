import prisma from '../config/db.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Calculate income and expense aggregates
    const [incomeAgg, expenseAgg, accounts, recentTransactions] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId, type: 'Income' },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: { userId, type: 'Expense' },
        _sum: { amount: true }
      }),
      prisma.account.findMany({
        where: { userId },
        select: { id: true, name: true, type: true, balance: true, color: true }
      }),
      prisma.transaction.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { date: 'desc' },
        take: 5
      })
    ]);

    const totalIncome = Number(incomeAgg._sum.amount || 0);
    const totalExpense = Number(expenseAgg._sum.amount || 0);
    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

    const netWorth = accounts.reduce((acc, curr) => acc + Number(curr.balance), 0);

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netSavings,
        savingsRate,
        netWorth,
        accounts,
        recentTransactions: recentTransactions.map(tx => ({
          id: tx.id,
          date: tx.date.toISOString().split('T')[0],
          description: tx.description,
          category: tx.category?.name || 'General',
          type: tx.type,
          amount: Number(tx.amount),
          icon: tx.icon || tx.category?.icon || 'Receipt',
          categoryColor: tx.categoryColor || tx.category?.color || '#64748b'
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBreakdown = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type = 'Expense' } = req.query;

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: type === 'Income' ? 'Income' : 'Expense'
      },
      include: {
        category: true
      }
    });

    const categoryMap = {};
    let grandTotal = 0;

    for (const tx of transactions) {
      const catName = tx.category?.name || 'Other';
      const catColor = tx.category?.color || '#64748b';
      const amount = Number(tx.amount);

      grandTotal += amount;

      if (!categoryMap[catName]) {
        categoryMap[catName] = {
          name: catName,
          amount: 0,
          color: catColor
        };
      }
      categoryMap[catName].amount += amount;
    }

    const breakdown = Object.values(categoryMap).map(item => ({
      ...item,
      percentage: grandTotal > 0 ? Math.round((item.amount / grandTotal) * 100) : 0
    })).sort((a, b) => b.amount - a.amount);

    res.status(200).json({
      success: true,
      data: {
        total: grandTotal,
        breakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyCashflow = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch past 12 months of transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'asc' }
    });

    const monthsMap = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (const tx of transactions) {
      const d = new Date(tx.date);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      const label = monthNames[d.getMonth()];

      if (!monthsMap[key]) {
        monthsMap[key] = {
          month: label,
          fullMonth: key,
          income: 0,
          expense: 0,
          savings: 0
        };
      }

      const amt = Number(tx.amount);
      if (tx.type === 'Income') {
        monthsMap[key].income += amt;
      } else {
        monthsMap[key].expense += amt;
      }
      monthsMap[key].savings = monthsMap[key].income - monthsMap[key].expense;
    }

    const cashflow = Object.values(monthsMap);

    res.status(200).json({
      success: true,
      data: cashflow
    });
  } catch (error) {
    next(error);
  }
};
