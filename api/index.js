require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./db/connect');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.get('/', function (req, res) {
  res.send('hello, world');
});

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
