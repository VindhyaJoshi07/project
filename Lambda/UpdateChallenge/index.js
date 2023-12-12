const AWS = require('aws-sdk')

exports.handler = async (event) => {
  
const documentClient = new AWS.DynamoDB.DocumentClient();
  
  let qid = parseInt(event.id);
  let longDescription = event.longDescription;
  let output = event.output
  let points = event.points
  let shortDescription = event.shortDescription
  
  const updateParams = {
    TableName: "Challenges",
    Key: {
        id:qid
    },
    UpdateExpression:
        'set #LongDescription = :longDescription, #ExpectedOutput = :ExpectedOutput, #points=:points, #shortDescription = :shortDescription',
    ExpressionAttributeNames: {
        '#LongDescription': 'LongDescription',
        '#ExpectedOutput': 'ExpectedOutput',
        '#points': 'points',
        '#shortDescription': 'shortDescription',
    },
    ExpressionAttributeValues: {
        ':longDescription': longDescription,
        ':ExpectedOutput': output,
        ':points': points,
        ':shortDescription': shortDescription
    },
    ReturnValues: "ALL_NEW"
}

   try {
     
     const updatedResponse = await documentClient.update(updateParams).promise();
     const response = {
           statusCode: 200,
           status: 'SUCCESS',
           body: "Updated challenge."+qid
      };
      return response;
    
  } catch(err) {
    console.log("Err..."+err);
     const response = {
      statusCode: 403,
      status: 'FAILURE',
      body: JSON.stringify("Can't Update challenge."+qid)
    };
    return response;
  }
  
};
