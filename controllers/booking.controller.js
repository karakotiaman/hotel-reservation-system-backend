const RoomAllocationService = require('../services/roomAllocation.service');
const { Room, Floor, Booking } = require('../models');

class BookingController {
  static async createBooking(req, res) {
    try {
      const { numberOfRooms } = req.body;
      
      if (!numberOfRooms || numberOfRooms < 1 || numberOfRooms > 5) {
        return res.status(400).json({
          error: 'Invalid number of rooms. Must be between 1 and 5.'
        });
      }
      const booking = await RoomAllocationService.createBooking(numberOfRooms);
      
      const rooms = await Room.findAll({
        where: { current_booking_id: booking.id },
        include: [{ model: Floor, as: 'floor' }]
      });

      res.status(201).json({
        message: 'Booking created successfully',
        booking: {
          id: booking.id,
          numberOfRooms: booking.number_of_rooms,
          totalTravelTime: booking.total_travel_time,
          rooms: rooms.map(room => ({
            roomNumber: room.room_number,
            floor: room.floor.floor_number,
            position: room.position
          }))
        }
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }

  static async getCurrentState(req, res) {
    try {
      const rooms = await Room.findAll({
        include: [
          { model: Floor, as: 'floor' },
          { model: Booking, as: 'booking', where: { status: 'active' }, required: false }
        ],
        order: [['floor_id', 'ASC'], ['position', 'ASC']]
      });

      const floors = await Floor.findAll({
        order: [['floor_number', 'ASC']]
      });

      const bookings = await Booking.findAll({
        where: { status: 'active' },
        include: [{
          model: Room,
          as: 'rooms',
          include: [{ model: Floor, as: 'floor' }]
        }]
      });

      res.json({
        floors: floors.map(floor => ({
          floorNumber: floor.floor_number,
          totalRooms: floor.total_rooms,
        })),
        rooms: rooms.map(room => ({
          roomNumber: room.room_number,
          floor: room.floor.floor_number,
          position: room.position,
          isOccupied: room.is_occupied,
          bookingId: room.current_booking_id
        })),
        bookings: bookings.map(booking => ({
          id: booking.id,
          numberOfRooms: booking.number_of_rooms,
          totalTravelTime: booking.total_travel_time,
          rooms: booking.rooms.map(room => ({
            roomNumber: room.room_number,
            floor: room.floor.floor_number,
            position: room.position
          }))
        }))
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch current state'
      });
    }
  }

  static async generateRandomOccupancy(req, res) {
    try {
      await RoomAllocationService.generateRandomOccupancy();
      res.json({ message: 'Random occupancy generated successfully' });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to generate random occupancy'
      });
    }
  }

  static async resetAllBookings(req, res) {
    try {
      await RoomAllocationService.resetAllBookings();
      res.json({ message: 'All bookings reset successfully' });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to reset bookings'
      });
    }
  }
}

module.exports = BookingController; 