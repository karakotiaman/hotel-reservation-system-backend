const { calculateTravelTime } = require('./roomCalculations');

const calculateTotalTravelTime = (rooms) => {
  if (!rooms || rooms.length <= 1) {
    return 0;
  }

  // sort rooms by floor and position
  const sortedRooms = [...rooms].sort((a, b) => {
    const floorA = Math.floor(a.room_number / 100);
    const floorB = Math.floor(b.room_number / 100);
    
    if (floorA !== floorB) {
      return floorA - floorB;
    }
    
    // sort by position
    return (a.room_number % 100) - (b.room_number % 100);
  });

  // calculate the total travel time between all rooms
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