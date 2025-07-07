// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const User = sequelize.define('User', {
//   user_id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   username: {
//     type: DataTypes.STRING(50),
//     allowNull: false,
//     unique: true
//   },
//   first_name: {
//     type: DataTypes.STRING(50),
//     allowNull: false
//   },
//   last_name: {
//     type: DataTypes.STRING(50),
//     allowNull: false
//   },
//   cnic: {
//     type: DataTypes.STRING(15),
//     allowNull: false
//   },
//   email: {
//     type: DataTypes.STRING(100),
//     allowNull: false,
//     unique: true
//   },
//   contact_number: {
//     type: DataTypes.STRING(15),
//     allowNull: true
//   },
//   password_hash: {
//     type: DataTypes.STRING(255),
//     allowNull: false
//   },
//   designation: {
//     type: DataTypes.STRING(50),
//     allowNull: true
//   },
//   department: {
//     type: DataTypes.STRING(100),
//     allowNull: true
//   },
//   department_section_id: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   date_of_birth: {
//     type: DataTypes.DATE,
//     allowNull: true
//   },
//   joining_date: {
//     type: DataTypes.DATE,
//     allowNull: true
//   },
//   role_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 2
//   },
//   gender: {
//     type: DataTypes.ENUM('Male', 'Female', 'Other'),
//     allowNull: true
//   },
//   office_address: {
//     type: DataTypes.STRING(255),
//     allowNull: true
//   },
//   photo_path: {
//     type: DataTypes.STRING(255),
//     allowNull: true
//   },
//   created_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW
//   }
// }, {
//   tableName: 'users',
//   timestamps: false
// });

// module.exports = User;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cnic: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  mobile: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user' // default to user unless specified
  }
}, {
  tableName: 'users',
  timestamps: false
});



module.exports = User;
