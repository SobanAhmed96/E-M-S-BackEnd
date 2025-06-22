import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './src/router/router.js';
import connectDB from "./src/db/index.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.send('Welcome to E-M-S');
});

const Port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(Port, () => {
      console.log(`Server is listening on http://localhost:${Port}`);
    });
  })
  .catch((err) => {
    console.error('DB Connection Error:', err);
  });
