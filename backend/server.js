const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", //Adjust this to your frontend url if needed
    methods: ["GET", "POST", "DELETE"]
  }
});

const createMatchRoute = require('./routes/createMatchRoute');
const joinMatchRoute = require('./routes/joinMatchRoute')(io);
const getMatchesRoute = require('./routes/getMatchesRoute');
const deletePlayerRoute = require('./routes/deletePlayerRoute')(io);


app.use("/api", joinMatchRoute);
app.use("/api", createMatchRoute);
app.use("/api", getMatchesRoute);
app.use("/api", deletePlayerRoute);

// WebSocket events
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinMatch", ({ matchCode }) => {
      socket.join(matchCode);
      console.log(`Socket ${socket.id} joined match ${matchCode}`);
  });

  socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
    res.send("Welcome to the backend API!");
  });

server.listen(PORT, () => console.log(`http://10.0.0.137:${PORT}`));