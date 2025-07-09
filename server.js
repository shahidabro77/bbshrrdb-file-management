const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const sequelize = require('./config/database');

// Middleware
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Ensure upload folders exist
const dirs = ['uploads', 'uploads/sent_files', 'uploads/received_files'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Static file routes
app.use('/uploads/received_files', express.static(path.join(__dirname, 'uploads/received_files')));
app.use('/uploads/sent_files', express.static(path.join(__dirname, 'uploads/sent_files')));
app.use('/uploads', express.static('uploads'));


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/received-files', require('./routes/receivedFileRoutes'));
app.use('/api/sent-files', require('./routes/sentFileRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/sections', require('./routes/sectionRoutes'));
app.use('/api', require('./routes/fileLogs'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));

// ✅ Replaced userAdminRoutes with the unified userRoutes
app.use('/api/users', require('./routes/user'));

// Start server
sequelize.sync().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`✅ Server running on port ${process.env.PORT}`)
  );
});
