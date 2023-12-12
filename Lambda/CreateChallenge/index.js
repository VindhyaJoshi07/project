const AWS = require('aws-sdk')

exports.handler = async (event) => {
  
  const documentClient = new AWS.DynamoDB.DocumentClient();
  
  let qid = Math.floor(Math.random() * 9000) + 1000;
  let longDescription = event.longDescription;
  let output = event.output
  let points = event.points
  let shortDescription = event.shortDescription
  
  
  var params = {
  TableName: 'Challenges',
  Item: {
    id: qid,
    LongDescription: longDescription,
    ExpectedOutput: output,
    points: points,
    shortDescription: shortDescription
  }
}

  
   try {
     
     const queryResponse = await documentClient.put(params).promise();
     const response = {
           statusCode: 200,
           status: 'SUCCESS',
           body: "Created challenge."+qid
      };
      return response;
    
  } catch(err) {
    console.log("Err..."+err);
     const response = {
      statusCode: 403,
      status: 'FAILURE',
      body: JSON.stringify("Can't Create challenge."+qid)
    };
    return response;
  }
  
};
