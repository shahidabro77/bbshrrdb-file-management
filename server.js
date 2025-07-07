const express = require('express');
const app = express();
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const movementRoutes = require('./routes/movementRoutes');
const receivedFileRoutes = require('./routes/receivedFileRoutes');
const sentFileRoutes = require('./routes/sentFileRoutes');
const fileLogsRoutes = require('./routes/fileLogs');

const path = require('path');

require('dotenv').config();
const cors = require('cors');

const fs = require('fs');
const dirs = ['uploads', 'uploads/sent_files', 'uploads/received_files'];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.use('/uploads', express.static('uploads'));


app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/received-files', receivedFileRoutes);
app.use('/api/sent-files', sentFileRoutes);
app.use('/api/search', require('./routes/searchRoutes'));

app.use('/uploads/received_files', express.static(path.join(__dirname, 'uploads/received_files')));
app.use('/uploads/sent_files', express.static(path.join(__dirname, 'uploads/sent_files')));

app.use('/api/sections', require('./routes/sectionRoutes'));
app.use('/api', fileLogsRoutes);

app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));

app.use('/api/users', require('./routes/userAdminRoutes'));



// app.use('/api/files', fileRoutes);
// app.use('/api/sections', sectionRoutes);
// app.use('/api/movements', movementRoutes);

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});
