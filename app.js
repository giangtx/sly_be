import createError from 'http-errors';
require('dotenv').config();
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
const debug = require("debug")("helloworld:server");
import http from "http";
import socketio from "socket.io";
import messageService from "./service/message.service";

import indexRouter from './routes/index';

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err.message)
  // render the error page
  res.status(err.status || 500);
  res.json({ 'error': err.message });
});

/**
 * Get port from environment and store in Express.
 */
const { PORT } = process.env;

const port = normalizePort(PORT);
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
/**
 * Event listener for HTTP server "listening" event.
 */

io.on("connect", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    socket.join(room);
    callback();
  });

  socket.on("sendMessage", async ({ name, message, room }, callback) => {
    const response = await messageService.createMessage({
      username: name,
      message,
      idChat: room,
    });
    io.to(room).emit("message", response);
    callback();
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});

const onListening = () => {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("I am listening on " + bind);
};
/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.log(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.log(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

