// const express = require('express');
// const app = express();
// const path = require('path');
// require('dotenv').config();

// // ✅ Serve uploaded files (like profile photos)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ✅ Serve static frontend assets (HTML, CSS, JS)
// app.use(express.static(path.join(__dirname, 'public')));

// // ✅ Route to serve index.html on root path
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // ✅ Route to serve dashboard.html
// app.get('/dashboard', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
// });

// // ⚠️ Do NOT use express.json() or urlencoded() here; multer handles form data
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // ✅ API routes for user creation (uses multer)
// const userRoutes = require('./routes/user');
// app.use('/api/users', userRoutes);

// // ✅ Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });


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


// app.use('/api/files', fileRoutes);
// app.use('/api/sections', sectionRoutes);
// app.use('/api/movements', movementRoutes);

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});
