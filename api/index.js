require('dotenv').config();
require('express-async-errors');
const cookieParser = require('cookie-parser');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./db/connect');

// custom middleware
const errorHandlerMiddleware = require('./middleware/errorHandler');

// routes
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: 'http://127.0.0.1:5173', credentials: true }));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () =>
      console.log(`app running on http://localhost:${PORT}`)
    );
  } catch (e) {
    console.log(e);
  }
};

start();
