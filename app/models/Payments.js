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
      allowNull: true
    },
    payerID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paymentID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    intent: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'Payments'
  });

  Payments.findThisYearsPaymentsByLT = userID => {
    let likeThisYear = "" + new Date().getFullYear() + "%";

    return sequelize.query("SELECT firstname, lastname FROM Payments WHERE UserId = " + userID + " AND createdAt LIKE '" + likeThisYear + "' ORDER BY lastname ASC;");
  };

  Payments.findThisYearsPayments = () => {
    let likeThisYear = "" + new Date().getFullYear() + "%";

    return sequelize.query("SELECT firstname, lastname FROM Payments WHERE createdAt LIKE '" + likeThisYear + "' ORDER BY lastname ASC;");
  };

  return Payments;
};
