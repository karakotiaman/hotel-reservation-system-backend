const { Room, Floor, Booking } = require('../models');
const { calculateTotalTravelTime } = require('../utils/bookingCalculations');

class RoomAllocationService {
  static async findOptimalRooms(numberOfRooms) {
    try {
      if (numberOfRooms > 5) {
        throw new Error('Maximum 5 rooms can be booked at a time');
      }
  
      // get all available rooms
      const availableRooms = await Room.findAll({
        where: { is_occupied: false },
        include: [{ model: Floor, as: 'floor' }],
        order: [['floor_id', 'ASC'], ['position', 'ASC']]
      });
  
      if (availableRooms.length < numberOfRooms) {
        throw new Error('Not enough rooms available');
      }
  
      // group rooms by floor
      const roomsByFloor = {};
      availableRooms.forEach(room => {
        if (!roomsByFloor[room.floor.floor_number]) {
          roomsByFloor[room.floor.floor_number] = [];
        }
        roomsByFloor[room.floor.floor_number].push(room);
      });
  
      // 1. first: find rooms on the same floor
      for (const floorNumber in roomsByFloor) {
        const floorRooms = roomsByFloor[floorNumber];
        if (floorRooms.length >= numberOfRooms) {
          return floorRooms.slice(0, numberOfRooms);
        }
      }
  
      // 2. second: find optimal combination
      return this.findOptimalCombination(availableRooms, numberOfRooms);
    } catch (err) {
      console.error('Error finding optimal rooms:', err);
      throw err;
    }
  }

  static areConsecutive(rooms) {
    for (let i = 1; i < rooms.length; i++) {
      if (rooms[i].position !== rooms[i - 1].position + 1) {
        return false;
      }
    }
    return true;
  }

  static findOptimalCombination(availableRooms, numberOfRooms) {
    let bestCombination = null;
    let minTravelTime = Infinity;

    // generate combinations
    const combinations = this.generateCombinations(availableRooms, numberOfRooms);

    for (const combination of combinations) {
      const travelTime = calculateTotalTravelTime(combination);
      if (travelTime < minTravelTime) {
        minTravelTime = travelTime;
        bestCombination = combination;
      }
    }

    return bestCombination;
  }

  static generateCombinations(rooms, r) {
    const combinations = [];
    const n = rooms.length;
    if (n === r) {
      return [rooms];
    }
    for (let i = 0; i <= n - r; i++) {
      for (let j = i + 1; j <= n - (r - 1); j++) {
        for (let k = j + 1; k <= n - (r - 2); k++) {
          if (r === 3) {
            combinations.push([rooms[i], rooms[j], rooms[k]]);
          } else {
            for (let l = k + 1; l <= n - (r - 3); l++) {
              if (r === 4) {
                combinations.push([rooms[i], rooms[j], rooms[k], rooms[l]]);
              } else {
                for (let m = l + 1; m < n; m++) {
                  combinations.push([rooms[i], rooms[j], rooms[k], rooms[l], rooms[m]]);
                }
              }
            }
          }
        }
      }
    }

    return combinations;
  }

  static async createBooking(numberOfRooms) {
    try {
      const optimalRooms = await this.findOptimalRooms(numberOfRooms);

      // create booking
      const booking = await Booking.create({
        number_of_rooms: numberOfRooms,
        total_travel_time: calculateTotalTravelTime(optimalRooms)
      });

      // update rooms
      await Promise.all(optimalRooms.map(room => 
        room.update({
          is_occupied: true,
          current_booking_id: booking.id
        })
      ));

      return booking;
    } catch (err) {
      console.error('Error creating booking:', err);
      throw err;
    }
  }

  static async resetAllBookings() {
    await Room.update(
      { is_occupied: false, current_booking_id: null },
      { where: {} }
    );
    await Booking.destroy({ where: {} });
  }

  static async generateRandomOccupancy() {
    // Reset all bookings first
    await this.resetAllBookings();

    // Get all available rooms
    const availableRooms = await Room.findAll({
      where: { is_occupied: false },
      include: [{ model: Floor, as: 'floor' }],
      order: [['floor_id', 'ASC'], ['position', 'ASC']]
    });

    if (availableRooms.length === 0) {
      throw new Error('No rooms available');
    }

    // Generate random number of rooms to occupy (1-10)
    const numberOfRoomsToOccupy = Math.floor(Math.random() * 97) + 1;
    
    // Randomly select rooms to occupy
    const roomsToOccupy = [];
    const usedIndices = new Set();

    while (roomsToOccupy.length < numberOfRoomsToOccupy && roomsToOccupy.length < availableRooms.length) {
      const randomIndex = Math.floor(Math.random() * availableRooms.length);
      
      if (!usedIndices.has(randomIndex)) {
        roomsToOccupy.push(availableRooms[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }

    // Create a single booking for all selected rooms
    const booking = await Booking.create({
      number_of_rooms: roomsToOccupy.length,
      total_travel_time: calculateTotalTravelTime(roomsToOccupy)
    });

    // Update all selected rooms
    await Promise.all(roomsToOccupy.map(room => 
      room.update({
        is_occupied: true,
        current_booking_id: booking.id
      })
    ));

    return {
      booking,
      occupiedRooms: roomsToOccupy
    };
  }
}

module.exports = RoomAllocationService;