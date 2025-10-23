import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ ok: true, name: 'SportsLine API' });
});

app.use('/api', routes);

export default app;

