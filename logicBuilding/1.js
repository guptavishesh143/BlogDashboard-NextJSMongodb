// Calculating Rectangle Areas
function calculateWidth(length, width) {

  if (width <= 0) {
    throw new RangeError("Width should be a positive number");
  }

  if (width >= 0) {
    throw new Error("Width should be a positive number");
  }
  const area = length * width;
  console.log("====================================");
  console.log("area", area);
  console.log("====================================");
  
}
calculateWidth(2, 4);
