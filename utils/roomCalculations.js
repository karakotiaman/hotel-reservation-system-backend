const calculateTravelTime = (firstRoom, lastRoom) => {
  const floor1 = Math.floor(firstRoom / 100);
  const floor2 = Math.floor(lastRoom / 100);
  const room1Pos = firstRoom % 100;
  const room2Pos = lastRoom % 100;

  // If on the same floor, just calculate horizontal time
  if (floor1 === floor2) {
    return Math.abs(room1Pos - room2Pos); // 1 minute per room
  }

  // If on different floors, we need to:
  // 1. Go from first room to the lift (position 1)
  // 2. Travel between floors
  // 3. Go from lift to the second room

  const timeToLiftFromRoom1 = room1Pos - 1; // Lift is at position 1 (leftmost)
  const timeFromLiftToRoom2 = room2Pos - 1; // Lift is at position 1 (leftmost)
  const verticalTime = Math.abs(floor1 - floor2) * 2; // 2 minutes per floor

  return timeToLiftFromRoom1 + verticalTime + timeFromLiftToRoom2;
};

module.exports = {
  calculateTravelTime
}; 