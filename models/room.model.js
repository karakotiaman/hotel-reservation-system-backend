'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      this.belongsTo(models.Floor, {
        foreignKey: 'floor_id',
        as: 'floor'
      });
      this.belongsTo(models.Booking, {
        foreignKey: 'current_booking_id',
        as: 'booking'
      });
    }
  }
  Room.init({
    room_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    floor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_occupied: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    current_booking_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    underscored: true,
    sequelize,
    modelName: 'Room',
    tableName: 'rooms'
  });
  return Room;
};