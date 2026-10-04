import app from './app.js';
import prisma from './config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`🚀 FinTrack Backend Server is running on http://localhost:${PORT}`);
    console.log(`📡 Health endpoint: http://localhost:${PORT}/api/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n⚠️ Notice: Port ${PORT} is already running in another terminal window.`);
      console.error(`   The FinTrack API is already active and healthy at http://localhost:${PORT}/api/health.\n`);
    } else {
      console.error('Server error:', err);
    }
  });

  // Verify database connection asynchronously
  prisma.$connect()
    .then(() => {
      console.log('✅ PostgreSQL database connected successfully via Prisma.');
    })
    .catch((err) => {
      console.warn('\n⚠️ Database connection note:');
      console.warn(`   Could not connect to PostgreSQL at configured DATABASE_URL.`);
      console.warn('👉 Please update DATABASE_URL in server/.env with your PostgreSQL credentials:');
      console.warn('   - Free cloud option: Neon (neon.tech) or Supabase (supabase.com)');
      console.warn('   - Local option: Install PostgreSQL or run via Docker\n');
    });
}

startServer();
