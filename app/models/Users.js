"use strict";

const crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {

  const Users = sequelize.define('Users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username_canonical: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email_canonical: {
      type: DataTypes.STRING,
      allowNull: false
    },
    enabled: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    locked: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    roles: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    tableName: 'Users',
    timestamps: false,
    classMethods: {
      associate: models => {

        Users.hasMany(models.Lifters);
        Users.hasMany(models.Payments);
      }
    }
  });

  Users.verifyPassword = (user, enteredPassword) => {

    const hashedPassword = crypto.createHash('md5')
      .update(`${user.salt}${enteredPassword}`)
      .digest('base64');

    if (user.password === hashedPassword) {

      return { match: true, user };
    }

    return { match: false };
  };

  return Users;
};
