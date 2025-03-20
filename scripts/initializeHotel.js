const { Floor, Room } = require('../models');

async function initializeHotel() {
  try {
    // Create floors
    for (let floorNumber = 1; floorNumber <= 10; floorNumber++) {
      const totalRooms = floorNumber === 10 ? 7 : 10;
      const floor = await Floor.create({
        floor_number: floorNumber,
        total_rooms: totalRooms,
        is_top_floor: floorNumber === 10
      });

      // Create rooms for each floor
      for (let position = 1; position <= totalRooms; position++) {
        const roomNumber = floorNumber === 10 
          ? 1000 + position 
          : (floorNumber * 100) + position;

        await Room.create({
          room_number: roomNumber,
          floor_id: floor.id,
          position: position,
          is_occupied: false
        });
      }
    }

    console.log('Hotel structure initialized successfully');
  } catch (error) {
    console.error('Error initializing hotel structure:', error);
    throw error;
  }
}

module.exports = initializeHotel; 