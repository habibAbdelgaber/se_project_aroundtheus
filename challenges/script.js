// Coding Challenges

// 1 - challenge
function printEven(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 2 === 0) {
      console.log(i);
    }
  }
}

printEven(10);
printEven(101);

// 2 - challenge
function isLeapYear(year) {
  if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
    return true;
  } else {
    return false;
  }
}

console.log(isLeapYear(2020)); // Output: true
console.log(isLeapYear(2022)); // Output: false
console.log(isLeapYear(1900)); // Output: false
console.log(isLeapYear(2000)); // Output: true

// 3 - challenge
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
}

fizzBuzz(15);
fizzBuzz(100);
