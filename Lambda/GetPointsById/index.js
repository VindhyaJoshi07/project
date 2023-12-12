const AWS = require('aws-sdk');

exports.handler = async (event) => {
  
  
  const documentClient = new AWS.DynamoDB.DocumentClient();
  
   let responseBody = "";
   let statusCode = 0;
    
    console.log("name..."+event.id);
    let userId = event.id

    const params = {
        TableName: "Points",
        Key: {
            name:userId
        }
    };
    
    console.log("Params.."+JSON.stringify(params))
    var challengeDescription = '';
    
     try {
        const data = await documentClient.get(params).promise();
        statusCode = 200;
        console.log("Data..."+JSON.stringify(data));
        
        const response = {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }
    
    return response;
    
    } catch (err) {
        responseBody = `Unable to get User Score: ${err}`;
        statusCode = 403;
        
         const response = {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseBody)
    }
    return response;
    }
 
};
