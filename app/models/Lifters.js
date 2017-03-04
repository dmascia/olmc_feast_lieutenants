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
      allowNull: false
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
  },
  {
    tableName: 'Lifters',
    timestamps: false,
    // classMethods: {
    //   associate: models => {
    //
    //     Lifters.BelongsToMany(models.Users);
    //   }
    // }
  });


  return Lifters;
};
