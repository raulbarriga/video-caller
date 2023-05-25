import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.send("Server is running.");
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id); // this is for the calling user

  socket.on("disconnect", () => {
    socket.broadcast.emit("Call Ended"); // message for when the call is terminated
  });

  // passing data from the frontend here
  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });
  socket.on("answercall", ({ to }) => {
    io.to(to).emit("callaccepted", { signal });
  });
});
server.listen(PORT, () => console.log("Server listening on port ", PORT));
