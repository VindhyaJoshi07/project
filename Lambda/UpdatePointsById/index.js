const AWS = require('aws-sdk')

exports.handler = async (event) => {
  
  let userId = event.userId;
  let points = parseInt(event.points)
  let challengedSolved = event.challengedSolved
  
   const documentClient = new AWS.DynamoDB.DocumentClient();
  
    console.log("name..."+userId);
 
    const params = {
        TableName: "Points",
        Key: {
            name:userId
        }
    };
    
    let currentScore = 0;
    let currSolvedChallenges = ""
    
     try {
        const data = await documentClient.get(params).promise();
        console.log("data.."+JSON.stringify(data))
        currentScore = data.Item.userpoints === ""? "0" : data.Item.userpoints;
        currSolvedChallenges = data.Item.solvedChallenges;
        currSolvedChallenges = currSolvedChallenges +","+ challengedSolved;
        console.log("currentScore.."+currentScore +"...currSolvedChallenges.."+currSolvedChallenges);
    } catch (err) {
        let responseBody = `Unable to get User Score: ${err}`;
        let statusCode = 403;
        
         const response = {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseBody)
       }
         return response;
    }
    
    //update points table 
    currentScore = parseInt(currentScore) + parseInt(points);
    console.log("currentScore.."+currentScore);
    
    var tableParams = {
    TableName: "Points",
    Key: {
            name:userId
        },
    Item: {
      "name":  userId,
      "solvedChallenges": currSolvedChallenges +"," +challengedSolved,
      "userpoints":  currentScore
    }
  };
  
  
  const updateParams = {
    TableName: "Points",
    Key: {
        name:userId
    },
    UpdateExpression:
        'set #solvedChallenges = :solvedChallenges, #userpoints = :userpoints',
    ExpressionAttributeNames: {
        '#solvedChallenges': 'solvedChallenges',
        '#userpoints': 'userpoints'
    },
    ExpressionAttributeValues: {
        ':solvedChallenges': currSolvedChallenges,
        ':userpoints': currentScore
    },
    ReturnValues: "ALL_NEW"
}
  try {
     
     const updatedResponse = await documentClient.update(updateParams).promise();
     const response = {
           statusCode: 200,
           status: 'SUCCESS',
           body: "Updated Score for the User."+userId
      };
      return response;
    
  } catch(err) {
    console.log("Err..."+err);
     const response = {
      statusCode: 403,
      status: 'FAILURE',
      body: JSON.stringify("Can't update score for the user.."+userId)
    };
    return response;
  }
 
};
