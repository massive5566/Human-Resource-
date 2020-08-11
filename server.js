// Required Modules for App
const express = require('express');
const connectDB = require('./config/db');
const fs = require('fs');
const cors = require('cors');
const authRoutes = require('./routes/api/auth');

// Express App
const app = express();

// Connect  Db
connectDB();

// init Mildware
app.use(express.json({ extended: false }));
app.use(cors());
app.get('/', (req, res) => {
  res.send('API Running');
});

//this url displays apis list
app.get('/docs', (req, res) => {
  fs.readFile('docs/apiDocs.json', (err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    const docs = JSON.parse(data);
    return res.json(docs);
  });
});

// app.get()
// Define Routes
app.use('/', authRoutes);
//to add other routes just do.
//app.use('/',companyRoutes);
// app.use('/api/users', require('./routes/api/user'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
