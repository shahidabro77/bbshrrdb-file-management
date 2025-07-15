// seedUsers.js
const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const User = require('./models/User'); // adjust if needed

const seedUsers = async () => {
  try {
    await sequelize.sync();

    const users = [
      {
        full_name: 'Admin User',
        cnic: '12345-6789012-3',
        email: 'admin@example.com',
        mobile: '03001234567',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        is_active: true,
        photo: null,
      },
      {
        full_name: 'Staff User',
        cnic: '98765-4321098-7',
        email: 'staff@example.com',
        mobile: '03111234567',
        password: await bcrypt.hash('staff123', 10),
        role: 'staff',
        is_active: true,
        photo: null,
      }
    ];

    await User.bulkCreate(users);
    console.log('✅ Seeded users successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Failed to seed users:', err);
    process.exit(1);
  }
};

seedUsers();
