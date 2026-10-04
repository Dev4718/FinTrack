-- ==============================================================================
-- FINTRACK POSTGRESQL / SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- All tables are already managed by Prisma and synchronized with Supabase!
-- This SQL script represents the exact schema structure in your database.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- TABLE 1: users
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    name TEXT NOT NULL,
    initials TEXT,
    currency TEXT DEFAULT 'INR',
    theme TEXT DEFAULT 'light',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE IF EXISTS users ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE IF EXISTS users ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS users ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- ==============================================================================
-- TABLE 2: accounts
-- ==============================================================================
CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'bank',
    balance DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    color TEXT DEFAULT '#3b82f6',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE IF EXISTS accounts ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE IF EXISTS accounts ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS accounts ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- ==============================================================================
-- TABLE 3: categories
-- ==============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Expense',
    icon TEXT NOT NULL DEFAULT 'Tag',
    color TEXT NOT NULL DEFAULT '#10b981',
    description TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE IF EXISTS categories ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE IF EXISTS categories ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS categories ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- ==============================================================================
-- TABLE 4: transactions
-- ==============================================================================
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "accountId" TEXT REFERENCES accounts(id) ON DELETE SET NULL,
    "categoryId" TEXT REFERENCES categories(id) ON DELETE SET NULL,
    amount DECIMAL(65, 30) NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    icon TEXT,
    "categoryColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE IF EXISTS transactions ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE IF EXISTS transactions ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS transactions ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- ==============================================================================
-- TABLE 5: budgets
-- ==============================================================================
CREATE TABLE IF NOT EXISTS budgets (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "categoryId" TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    "limit" DECIMAL(65, 30) NOT NULL,
    month TEXT NOT NULL,
    "alertThreshold" INTEGER NOT NULL DEFAULT 80,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_category_month UNIQUE ("userId", "categoryId", month)
);
ALTER TABLE IF EXISTS budgets ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE IF EXISTS budgets ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS budgets ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- ==============================================================================
-- TABLE 6: goals
-- ==============================================================================
CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    "targetAmount" DECIMAL(65, 30) NOT NULL,
    "currentAmount" DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    "targetDate" TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    color TEXT NOT NULL DEFAULT '#10b981',
    icon TEXT NOT NULL DEFAULT 'Target',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE IF EXISTS goals ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE IF EXISTS goals ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE IF EXISTS goals ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- ==============================================================================
-- TABLE 7: notifications
-- ==============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    read BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE IF EXISTS notifications ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE IF EXISTS notifications ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- ==============================================================================
-- INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions("userId", date DESC);
CREATE INDEX IF NOT EXISTS idx_budgets_user_month ON budgets("userId", month);
CREATE INDEX IF NOT EXISTS idx_categories_user ON categories("userId");
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications("userId", read);


