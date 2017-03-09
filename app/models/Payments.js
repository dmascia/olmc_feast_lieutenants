"use strict";

module.exports = function(sequelize, DataTypes) {

  const Payments = sequelize.define('Payments', {
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
    paymentToken: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payerID: {
      type: DataTypes.STRING,
      allowNull: false
    },
    paymentID: {
      type: DataTypes.STRING,
      allowNull: false
    },
    intent: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'Payments'
  });

  return Payments;
};
