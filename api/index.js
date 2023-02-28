const express = require('express');
const cors = require('cors');
const morgan = require('morgan');


const app = express();

app.use(morgan('combined'))
app.use(express.json());
app.use(cors())

app.get('/', function (req, res) {
  res.send('hello, world')
})

app.get('/some', function ( req, res) {
  res.send('some what?')
})

app.listen(5000, () => console.log('app running on 5000'))
