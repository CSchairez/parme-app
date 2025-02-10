const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", //Adjust this to your frontend url if needed
    methods: ["GET", "POST"]
  }
});

const PORT = 5000;
app.use(cors());
app.use(express.json());

const createMatchRoute = require('./createMatchRoute')
const routes = require('./routes');
const { create } = require('domain');

app.use("/api", routes);
app.use("/api", createMatchRoute);

app.get("/", (req, res) => {
    res.send("Welcome to the backend API!");
  });

server.listen(PORT, () => console.log(`http://10.0.0.137:${PORT}`));