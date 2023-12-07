
$(document).ready(function () {
    /**
     * It will crate a user in Cognito
     */
    $("#createAccount").click(function () {
      var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      var username = $("#username").val();
      var password = $("#password").val();
      var userAttribute = new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "email",
        Value: $("#email").val(),
      });
  
    
      userPool.signUp(username, password, [userAttribute], null, function (err, result) {
        if (err) {
          alert("Incorrect credentials or unconfirmed account, please try creating account with different email address");
        } else {
          location.href =
            "https://my-app07.s3.us-east-1.amazonaws.com/confirm.html#" +
            username;
        }
      });
    });
  
    /**
     * This method will validate the verification code 
     * sent to user email.
     */
    $("#confirm").click(function () {
      let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      let username = location.hash.substring(1);
  
      let cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: username,
        Pool: userPool,
      });

      cognitoUser.confirmRegistration(
        $("#code").val(),
        true,
        function (err, results) {
          if (err) {
            alert("Invalid Code.."+err);
          } else {
  
            // create user - an entry created in points table in dynamodb
            // getting CREATE_USER_API_ENDPOINT from constants.js file
          let createAPIUrl = CREATE_USER_API_ENDPOINT
          const body = {
            name: username,
            solvedChallenges: '',
            userpoints: ''
          };

          const requestUserOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          };
          /**
           * API wil create user entry in points table.
           */
          fetch(createAPIUrl, requestUserOptions)
            .then((response) => {
              console.log("response..." + JSON.stringify(response));
              return response.json();
            })
            .then((data) => {
              console.log("Data" + JSON.stringify(data));

            location.href =
            "https://my-app07.s3.us-east-1.amazonaws.com/problems.html#" +
            username;
            })
            .catch((error) => {
              console.error("Error:", error);
              alert("Error:", error);
            });
          }
        }
      );
    });
  
    /**
     * Method to resend the confirmation code.
     */
    $("#resend").click(function () {
      let username = location.hash.substring(1);
      let cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: username,
        Pool: userPool,
      });
      cognitoUser.resendConfirmationCode(function (err) {
        if (err) {
          console.log(err);
          alert("Not able to send the code.."+err)
        }
      });
    });
  
    ////---------------------- Login -------------------------
    $("#login").click(function () {

      let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      let username = $("#username").val();
  
      let authenticationData = {
        Username: username,
        Password: $("#password").val(),
      };
  
      let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
      );

      let userData = {
        Username: username,
        Pool: userPool,
      };

      let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function () {
          console.log("Success..");
  
          if (username === 'admin') {
            location.href = "https://my-app07.s3.us-east-1.amazonaws.com/admin.html";
          } else {
           location.href =
            "https://my-app07.s3.us-east-1.amazonaws.com/problems.html#" +
            username;
          }
  
         
        },
        onFailure: function (err) {
          alert(err);
        },
      });
    });
});