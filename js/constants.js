// API to crate user
const CREATE_USER_API_ENDPOINT= "https://5q9x9srwc6.execute-api.us-east-1.amazonaws.com/prod/users/createuser";

// API to create challenge and add in challenges table in dynamodb
const CREATE_CHALLENGE_API_ENDPOINT = "https://5q9x9srwc6.execute-api.us-east-1.amazonaws.com/prod/challenges/createChallenge";

// API to update challenge
const UPDATE_CHALLENGE_API_ENDPOINT = "https://5q9x9srwc6.execute-api.us-east-1.amazonaws.com/prod/challenges/update/"; 

//// API to get challenges details by ID
const GET_CHALLENGES_BY_ID_API_ENDPOINT = "https://5q9x9srwc6.execute-api.us-east-1.amazonaws.com/prod/challenges/getChallengeById/";

// API to evaluate challenge
const EVALUATE_CHELLENGE_API_ENDPOINT = "https://5q9x9srwc6.execute-api.us-east-1.amazonaws.com/prod/challenges/execute";

// API to update user points
const UPDATE_POINTS_API_ENDPOINT = "https://5q9x9srwc6.execute-api.us-east-1.amazonaws.com/prod/challenges/updatePoints";