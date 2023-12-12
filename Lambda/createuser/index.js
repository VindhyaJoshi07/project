const AWS = require('aws-sdk')

exports.handler = async (event) => {
  
  const documentClient = new AWS.DynamoDB.DocumentClient();
  
  let name = event.name
  let solvedChallenges = event.solvedChallenges;
  let userpoints = event.userpoints === "" ? 0 : event.userpoints
  
  var params = {
  TableName: 'Points',
  Item: {
    name: name,
    solvedChallenges: solvedChallenges,
    userpoints: userpoints
  }
}

  
   try {
     
     const queryResponse = await documentClient.put(params).promise();
     const response = {
           statusCode: 200,
           status: 'SUCCESS',
           body: "Created User."+name
      };
      return response;
    
  } catch(err) {
    console.log("Err..."+err);
     const response = {
      statusCode: 403,
      status: 'FAILURE',
      body: JSON.stringify("Can't Create User."+name)
    };
    return response;
  }
  
};