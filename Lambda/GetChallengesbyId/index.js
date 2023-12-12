const AWS = require('aws-sdk');

exports.handler = async (event) => {

  const documentClient = new AWS.DynamoDB.DocumentClient();

    let responseBody = "";
    let statusCode = 0;
    
    console.log("id..."+event.id);
    let challengeId = event.id

    const params = {
        TableName: "Challenges",
        Key: {
            id: parseInt(challengeId)
        }
    };
    
    console.log("Params.."+JSON.stringify(params))
    var challengeDescription = '';
    
    let data = '';
    
     try {
         data = await documentClient.get(params).promise();
        console.log("Data.."+JSON.stringify(data));
        statusCode = 200;
    } catch (err) {
        responseBody = `Unable to get Challenge: ${err}`;
        statusCode = 403;
    }

   

    const response = {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application',
        },
        body: JSON.stringify(data)
    };
    
    return response;
};

