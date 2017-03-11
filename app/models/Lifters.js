"use strict";

module.exports = function(sequelize, DataTypes) {

  const Lifters = sequelize.define('Lifters', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tshirt_size: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isRemoved: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    isNotLifter: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  },
  {
    tableName: 'Lifters'
  });


  return Lifters;
};
