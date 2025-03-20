const { calculateTravelTime } = require('./roomCalculations');

const calculateTotalTravelTime = (rooms) => {
  // If there are no rooms or only one room, the total travel time is 0
  if (!rooms || rooms.length <= 1) {
    return 0;
  }

  // Sort rooms by floor and position to calculate minimum travel time
  const sortedRooms = [...rooms].sort((a, b) => {
    const floorA = Math.floor(a.room_number / 100);
    const floorB = Math.floor(b.room_number / 100);
    
    // First sort by floor
    if (floorA !== floorB) {
      return floorA - floorB;
    }
    
    // Then sort by position within the floor
    return (a.room_number % 100) - (b.room_number % 100);
  });

  // Calculate the total travel time between all rooms
  let totalTime = 0;
  for (let i = 0; i < sortedRooms.length - 1; i++) {
    totalTime += calculateTravelTime(
      sortedRooms[i].room_number,
      sortedRooms[i + 1].room_number
    );
  }
  
  return totalTime;
};

module.exports = {
  calculateTotalTravelTime
}; 