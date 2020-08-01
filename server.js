// Required Modules for App
const express = require('express');
const connectDB = require('./config/db');

// Express App
const app = express();

// Connect  Db
connectDB();

// init Mildware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.send('API Running');
});

// Define Routes
app.use('/api/users', require('./routes/api/user'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
