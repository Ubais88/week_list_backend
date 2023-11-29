const express = require("express");
const app = express();
require("dotenv").config();
const {dbConnect} = require('./config/database')

app.use(express.json());
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("App listening on port", PORT);
});

dbConnect();
const routes = require('./routes/user');
app.use('/api/v1',routes)

// base route
app.get("/", (req, res) => {
  res.send("<h1>Week List</h1>");
});

// Health check route
app.get('/health', (req, res) => {
  const serverName = 'Week_List_Server';
  const currentTime = new Date().toLocaleTimeString();
  const serverState = 'active'; 

  const response = {
    serverName,
    currentTime,
    serverState,
  };

  res.json(response);
});

// route not found
app.use((req, res, next) => {
  res.status(404).send("<h1>Route not found</h1>");
});
