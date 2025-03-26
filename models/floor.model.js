'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Floor extends Model {
    static associate(models) {
      this.hasMany(models.Room, {
        foreignKey: 'floor_id',
        as: 'rooms'
      });
    }
  }
  Floor.init({
    floor_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    total_rooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    occupied: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    underscored: true,
    sequelize,
    modelName: 'Floor',
    tableName: 'floors'
  });
  return Floor;
};