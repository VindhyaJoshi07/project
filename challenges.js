

let challengesArray = [
    {
        "id": 1,
    "challenge": "Write a program to convert a given integer (in days) to years, months and days, assuming that all months have 30 days and all years have 365 days.\n Test Data to input : 2535.\n Expected Output: 6Y, 11M, 15D"
  },

  {
    "id": 2,
    "challenge": "Write a  program that accepts 9 integers from the user and finds the highest value and the input position.<br>For example if 2  19  5   0   9   1  45  3  6  7 is the input,<br>output is<br>number:45 position:7"
  },

  {
    "id": 3,
    "challenge": "Write a program to calculate the value of S where S = 1 + 3/2 + 5/4 + 7/8.<br>Expected Output:<br>4.62"
  },
  
  {
    "id": 4,
    "challenge": "Write a C program to read an array of length 5. Change the first element by the last, and the second element by the fourth. Print the elements of the modified array.<br>example:<br>input: 15 20 25 30 35<br> Output:<br>35 30 25 20 15"
  },

  {
    "id": 5,
    "challenge": "Write a program that accepts a positive integer between 100 and 500 and prints out the sum of the digits of this number.<br>example:<br>Input:347<br>Output:<br>Sum of the digits of 347 is 14"
  }
  ]


let currentChallengeId = 0;
const challengeElement = document.getElementById("challenge");

// Display current challenge
function displayCurrentChallenge() {
  challengeElement.innerHTML = challengesArray[currentChallengeId].challenge;
}

// Display the initial challenge
displayCurrentChallenge();


 // Function to display the previous challenge
function displayPreviousChallenge() {
  if(currentChallengeId > 0){
    currentChallengeId--;
    displayCurrentChallenge();
  }
}

 // Function to display the next challenge
 function displayNextChallenge() {
  if(currentChallengeId < challengesArray.length-1){
    currentChallengeId++;
    displayCurrentChallenge();
  }
 }