import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabaseSchema } from './db/database.js';
import { seedDatabaseIfEmpty } from './db/seeder.js';
import { projectRouter } from './routes/projectRoutes.js';
import { aiRouter } from './routes/aiRoutes.js';
import { designerRouter } from './routes/designerRoutes.js';
import { chatRouter } from './routes/chatRoutes.js';
import { catalogRouter } from './routes/catalogRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api/projects', projectRouter);
app.use('/api/ai', aiRouter);
app.use('/api/designers', designerRouter);
app.use('/api/chat', chatRouter);
app.use('/api/catalog', catalogRouter);

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    platform: 'AERA — AI Spatial Design & Interior Planning Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Startup server & initialize database
async function bootstrap() {
  try {
    console.log('🚀 Initializing AERA Spatial Server...');
    await initDatabaseSchema();
    await seedDatabaseIfEmpty();

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(` ✨ AERA Spatial Intelligence REST API Server Running`);
      console.log(` 🌐 Endpoint: http://localhost:${PORT}`);
      console.log(` 🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
}

bootstrap();
