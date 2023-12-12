const AWS = require('aws-sdk');

exports.handler = async (event) => {

  const documentClient = new AWS.DynamoDB.DocumentClient();

    let responseBody = "";
    let statusCode = 0;
    let userPoints = 0;
    let input = event.id.split("-")
    
    console.log("id..."+event.id);
    let challengeId = input[1]
    let userName = input[0]
    console.log("challengeId.."+challengeId);
    console.log("userName.."+userName);
    
    
    
    //--------Get User Points
    
     const pointsParams = {
        TableName: "Points",
        Key: {
            name:userName
        }
    };
    
     try {
        const data = await documentClient.get(pointsParams).promise();
        userPoints = data.Item.userpoints;
        console.log("userPoints..."+userPoints);
    } catch (err) {
        responseBody = `Unable to get User Points: ${err}`;
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
    
    
    //--------Get User Points

    const params = {
        TableName: "Challenges",
        Key: {
            id: parseInt(challengeId)
        }
    };
    
    console.log("Params.."+JSON.stringify(params))
    var challengeDescription = '';
    
     try {
        const data = await documentClient.get(params).promise();
        console.log("responseBody.."+data.Item.LongDescription)
        challengeDescription = data.Item.LongDescription;
        statusCode = 200;
    } catch (err) {
        responseBody = `Unable to get Challenge: ${err}`;
        statusCode = 403;
    }

    const htmlContent = '<html><h1>Hello Krish, this is your HTML content!</h1><html>';

    const response = {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'text/html',
        },
        body: htmlContent
    };
    
    return generateHtmlPage(challengeDescription, challengeId, userName, userPoints);
};

function generateHtmlPage(content, challengeId, userName, userPoints) {
  /* for security always escape output html */
  // const safeValues = escapeHtml(content)
 
    var html = `
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Challenges</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://my-app07.s3.us-east-1.amazonaws.com/css/site.css" />

  
    
</head>
<body style="background-color: #e0dee5">

<nav class="navbar navbar-expand-lg navbar-custom">
    <a class="navbar-brand" href="#">iCanCode</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
            <li class="nav-item active">
                <a class="nav-link" href="index.html">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="articles.html">Articles</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="about.html">About</a>
            </li>
        </ul>
        <nav class="points" id="pointsNav"> Points: </nav>
        <div><span id="pointsValue">${userPoints}</span></div>
        
    </div>
</nav>

<div class="container-fluid">
    <div class="row">
        <div class="col-lg-6 challenge-div">
            <div id="challenge">
               ${content}
            </div>
        </div>
        
        <div class="col-lg-6 challenge-div">
            <div id="codeArea" class="challenge-right-div">
                <h6>Select Language: </h6>
                <select id="lang" class="dropdown">
                    <option value="java"> Java </option>
                    <option value="c"> C </option>
                    <option value="python"> Python </option>
                </select><br> &nbsp;&nbsp;
            </div>
            <div>
                <textarea id="myTextEditor" rows="15" cols="70">
                </textarea>
                <div>
                    <textarea id="displayOutput" rows="2" cols="70" style="border: #e0dee5;"></textarea>
                </div>
            </div>
            <input type = "hidden" id="questionId" name = "questionId" value= "${challengeId}">
            <input type = "hidden" id="userName" name = "userName" value= "${userName}">
            <button id="submitChallenge" style="margin-top: 7%; margin-left: 20%;">Submit Challenge</button>
            <button id="displayChallenge" style="margin-left: 10%;" >All Challenges</button>
        </div>
    </div>
</div> 

<script src="https://my-app07.s3.us-east-1.amazonaws.com/js/amazon-cognito-identity.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
<script src="https://my-app07.s3.us-east-1.amazonaws.com/js/amazon-cognito-identity.min.js"></script>
  <script src="https://my-app07.s3.us-east-1.amazonaws.com/js/site.js"></script>
</body>

</html>`;

return html;
}