require('dotenv').config();
require('express-async-errors');
const cookieParser = require('cookie-parser');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const ws = require('ws');

const connectDB = require('./db/connect');

// custom middleware
const errorHandlerMiddleware = require('./middleware/errorHandler');

// routes
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const { decodeToken } = require('./utils/helper');
const Message = require('./models/Message');

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
    const server = app.listen(PORT, () =>
      console.log(`app running on http://localhost:${PORT}`)
    );

    // set up websocket connection
    const wsServer = new ws.WebSocketServer({ server });
    wsServer.on('connection', (connection, req) => {
      const cookies = req.headers.cookie;
      // get username and id from the cookie
      // let's ensure we get our token that starts with 'token='
      // incase there are more cookies in the headers
      // note: multiple cookies are separated by ';'
      const cookieString = cookies
        .split(';')
        .find((cookie) => cookie.startsWith('token='));
      if (cookieString) {
        const token = cookieString.split('=')[1];

        if (token) {
          const { userId, username } = decodeToken(token);

          connection.userId = userId;
          connection.username = username;
        }
      }

      connection.on('message', async (message) => {
        const messageData = JSON.parse(message.toString());
        const { recipient, text } = messageData;

        if (recipient && text) {
          // save message to db
          const messageDoc = await Message.create({
            sender: connection.userId,
            recipient,
            text
          });

          // the recipient may be connected on multiple devices
          // that's why we use filter instead of find to get
          // all connection instances and notify him
          [...wsServer.clients]
            .filter((client) => client.userId === recipient)
            .forEach((c) =>
              c.send(
                JSON.stringify({
                  text,
                  sender: connection.userId,
                  recipient,
                  id: messageDoc._id
                })
              )
            );
        }
      });

      // notify everyone about online users
      [...wsServer.clients].map((client) => {
        client.send(
          JSON.stringify({
            online: [...wsServer.clients].map((client) => ({
              userId: client.userId,
              username: client.username
            }))
          })
        );
      });
    });
  } catch (e) {
    console.log(e);
  }
};

start();
