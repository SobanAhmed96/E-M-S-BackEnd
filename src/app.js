import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router/router.js';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    // credentials: true,
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/v1', router);
app.get('/', (req, res) => {
  console.log(res.send('Wellcome to E-M-S'));
});

export default app;
