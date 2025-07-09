const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReceivedFile = require('./received_file')(sequelize, DataTypes);
const SentFile = require('./sent_file')(sequelize, DataTypes);
const Section = require('./Section')(sequelize, DataTypes);
const FileLog = require('./FileLog')(sequelize, DataTypes);
const User = require('./User'); // ✅ DON'T invoke with (sequelize, DataTypes)
const Role = require('./Role')(sequelize, DataTypes);

// Export models
module.exports = {
  sequelize,
  ReceivedFile,
  SentFile,
  Section,
  FileLog,
  User,
  Role
};
