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

  // calculate the total travel time between first and last room
  return calculateTravelTime(
    sortedRooms[0].room_number, 
    sortedRooms[sortedRooms.length - 1].room_number
  );
  
};

module.exports = {
  calculateTotalTravelTime
}; 