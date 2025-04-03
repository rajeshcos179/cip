import express from "express";
import http from 'http';
import { Server } from 'socket.io'; 
import sequelize from "./config/database.js";
import Stations from "./model/Stations.js";
import camera from "./model/Camera.js";
import threat from "./model/Threat.js";
import cors from "cors";
import stationRoutes from "./routes/stationRoutes.js";
import threatRoutes from "./routes/threatRoutes.js";
import bodyParser from "body-parser"; 



const app = express();
const PORT = 5000;


app.use(express.json({ limit: "50mb" })); // Increase payload limit to 50MB
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Also increase URL-encoded body limit

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Connected to NeonDB successfully!");

    await sequelize.sync({ alter: true });
    console.log("Database Synchronised");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

connectDB();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json()); 

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api", stationRoutes);
app.use("/api", threatRoutes);


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});