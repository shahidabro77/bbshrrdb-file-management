const sequelize = require('./config/database');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  } finally {
    await sequelize.close();
  }
})();
