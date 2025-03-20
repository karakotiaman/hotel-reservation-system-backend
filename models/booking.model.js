'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      this.hasMany(models.Room, {
        foreignKey: 'current_booking_id',
        as: 'rooms'
      });
    }

  }
  Booking.init({
    number_of_rooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_travel_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('active', 'cancelled'),
      defaultValue: 'active'
    }
  }, {
    underscored: true,
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings'
  });
  return Booking;
};