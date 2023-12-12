const AWS = require('aws-sdk');

exports.handler = async (event) => {
  
   const documentClient = new AWS.DynamoDB.DocumentClient();

    let responseBody = "";
    let statusCode = 0;

    const params = {
        TableName: "Challenges"
    };
    
     let challenges = [];

    try {
        const data = await documentClient.scan(params).promise();
        statusCode = 200;
        for (var i=0; i < data.Items.length; i++) {
            console.log("Data.."+data.Items[i].shortDescription)
            challenges.push({
                "id": data.Items[i].id,
                "description": data.Items[i].shortDescription
            });
        }
    } catch (err) {
        responseBody = `Unable to get Challenges: ${err}`;
        statusCode = 403;
    }   

    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(challenges)
    };

    return response;
};
