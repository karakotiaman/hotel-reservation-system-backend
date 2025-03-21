const calculateTravelTime = (firstRoom, lastRoom) => {
  const floor1 = Math.floor(firstRoom / 100);
  const floor2 = Math.floor(lastRoom / 100);
  const room1Pos = firstRoom % 100;
  const room2Pos = lastRoom % 100;

  // if on the same floor, just calculate horizontal time
  if (floor1 === floor2) {
    return Math.abs(room1Pos - room2Pos); // 1 minute per room
  }

  const timeToLiftFromRoom1 = room1Pos - 1;
  const timeFromLiftToRoom2 = room2Pos - 1;
  const verticalTime = Math.abs(floor1 - floor2) * 2;

  return timeToLiftFromRoom1 + verticalTime + timeFromLiftToRoom2;
};

module.exports = {
  calculateTravelTime
}; 