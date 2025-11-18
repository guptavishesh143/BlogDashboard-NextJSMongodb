// write a function that tells if a given number is even or odd

function evenOrOdd(num) {
  return num % 2 == 0 ? "Even" : "Odd";
}

const result = evenOrOdd;
// console.log(result(373));

function smallestOfThree(a, b, c) {
  if (a < b && a < c) {
    return a;
  }
  if (b < a && b < c) {
    return b;
  }
  if (c < a && c < b) {
    return c;
  }
  return a;
}

// console.log("====================================");
// console.log("smallestOfThree()", smallestOfThree(-3, 1, 6));
// console.log("smallestOfThree()", smallestOfThree(3, 3, 3));
// console.log("====================================");

function SmallestNoofThree1(a, b, c) {
  let smallestNo = a;
  if (b < smallestNo) {
    return b;
  }
  if (c < smallestNo) {
    return c;
  }

  return smallestNo;
}
// console.log("====================================");
// console.log("SmallestNoofThree1()", SmallestNoofThree1(-3, 1, 6));
// console.log("SmallestNoofThree1()", SmallestNoofThree1(3, 3, 3));
// console.log("====================================");


function SmallestNoInArray(arr) {
  // if (!arr || arr.length === 0) {
  //   return undefined;
  // }
  let smallestNo = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < smallestNo) {
      smallestNo = arr[i];
    }
  }
  return smallestNo;
}

