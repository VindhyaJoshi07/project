const AWS = require('aws-sdk');

exports.handler = async (event) => {

  const documentClient = new AWS.DynamoDB.DocumentClient();

    let responseBody = "";
    let statusCode = 0;
    
    let challengeId = event.id;
    
    console.log("id..."+challengeId);

    const params = {
        TableName: "Challenges",
        Key: {
            id: parseInt(challengeId)
        }
    };
    
    console.log("Params.."+JSON.stringify(params))
    var challengeDescription = '';
    var shortDescription = '';
    var points = '';
    var expectedOutput = '';
    
     try {
        const data = await documentClient.get(params).promise();
        console.log("responseBody.."+JSON.stringify(data.Item))
        challengeDescription = data.Item.LongDescription;
        shortDescription = data.Item.shortDescription
        points = data.Item.points
        expectedOutput = data.Item.ExpectedOutput
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
    
    return generateHtmlPage(challengeDescription, shortDescription, points, expectedOutput, challengeId);
};

function generateHtmlPage(challengeDescription, shortDescription, points, expectedOutput, challengeId) {
  /* for security always escape output html */
  // const safeValues = escapeHtml(content)
 
    var html = `
 
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iCanCode</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/site.css" />

    <style>
        body{
            background-image: url('http://3.bp.blogspot.com/-9oWS0TFITP4/T6k-8E2_BJI/AAAAAAAACiY/9Qh0zUZBPK4/s1600/Abstract+Blue+Wallpapers.jpg');
        }
        textarea{
            background-color: transparent;
        }
    </style>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-custom">
        <a class="navbar-brand" href="#">iCanCode</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
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
                    <a class="nav-link" href="#">Forum</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="about.html">About</a>
                </li>
            </ul>
        </div>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mr-auto"></ul>
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="index.html" id="signup">Sign out</a>
                </li>

            </ul>
        </div>
    </nav>
    
    <div class="container-admin">
        <div class="row">
        <div id = "showMessage" class = "showMessage"></div>
           <form>
            <div class="col-xl-8">
                <textarea rows="2" id="shortDescription" cols="150" placeholder="Short description">${shortDescription}</textarea>
            </div> <br>
            <div class="col-xl-8">
                <textarea rows="5" id="longDescription" cols="150" placeholder="Long description">${challengeDescription}</textarea>
            </div> <br>
            <div class="col-xl-8">
                <textarea rows="2" id="expectedOutput" cols="150" placeholder="Expected Output">${expectedOutput}</textarea>
            </div> <br>
            <div class="col-xl-8">
                <textarea rows="1" id="points" cols="150" placeholder="Points">${points}</textarea>
            </div> <br>
        </form>
        </div>
    </div>
    
    <div class="container" style="width:100%">
        <div class="row admin-div">
            <div class="col-sm-3 text-center">
                <button class="btn update-challenge" id="challengeupdate" style="background-color:rgb(216, 204, 95);color:white">Update</button>
            </div>
        </div>
        <input type = "hidden" id="questionId" name = "questionId" value= "${challengeId}">
</div>

<script src="https://my-app07.s3.us-east-1.amazonaws.com/js/amazon-cognito-identity.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
<script src="https://my-app07.s3.us-east-1.amazonaws.com/js/amazon-cognito-identity.min.js"></script>
   

    
    <!--<script src="https://my-app07.s3.us-east-1.amazonaws.com/js/site.js"></script>-->
    <script src="https://my-app07.s3.us-east-1.amazonaws.com/js/site.js"></script>
</body>
</html>`;

return html;
}