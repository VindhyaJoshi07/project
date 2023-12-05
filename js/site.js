

$(document).ready(function () {
  $("#createAccount").click(function () {
    console.log("inside create Account..");
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var username = $("#username").val();
    var password = $("#password").val();
    var email = new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: "email",
      Value: $("#email").val(),
    });

    console.log("username.." + username + "..password.." + password + "..email.." + email);
    userPool.signUp(username, password, [email], null, function (err, result) {
      if (err) {
        alert("Incorrect credentials");
      } else {
        console.log("inside success");
        location.href =
          "https://my-app07.s3.us-east-1.amazonaws.com/confirm.html#" +
          username;
      }
    });
  });

  //--------------------------
  $("#confirm").click(function () {
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var username = location.hash.substring(1);
    console.log("username.." + username);
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: username,
      Pool: userPool,
    });
    cognitoUser.confirmRegistration(
      $("#code").val(),
      true,
      function (err, results) {
        if (err) {
          console.log(err);
        } else {

          // create user - an entry created in points table in dynamodb
        let createAPIUrl = 'https://5q9x9srwc6.execute-api.us-east-1.amazonaws.com/prod/users/createuser';
        
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
          });
        }
      }
    );
  });

  ////--------------------------
  $("#resend").click(function () {
    var username = location.hash.substring(1);
    console.log("username.." + username);
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: username,
      Pool: userPool,
    });
    cognitoUser.resendConfirmationCode(function (err) {
      if (err) {
        console.log(err);
      }
    });
  });

  ////---------------------- Login -------------------------
  $("#login").click(function () {
    
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    console.log("inside login");

    var username = $("#username").val();

    var authenticationData = {
      Username: username,
      Password: $("#password").val(),
    };

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    var userData = {
      Username: username,
      Pool: userPool,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function () {
        console.log("Success..");

        if (username === 'admin') {
          location.href = "https://my-app07.s3.us-east-1.amazonaws.com/admin.html";

        }else {
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

  $("#displayChallenge").click(function () {
    var username = $("#userName").val();
    console.log('problems page...'+username);
    location.href = "https://my-app07.s3.us-east-1.amazonaws.com/problems.html#" + username;
  });


  //// ---------------------- Submit Challenge -----------------------
  $("#submitChallenge").click(function () {
    //1.fetch question info ExpectedOutput, question Points.

    let currentPoints = '';
    let questionId = $("#questionId").val();
    
    // console.log("questionId.." + questionId);

    let username = $("#userName").val();
  
    console.log("username.."+username);
    const apiUrl =
      "https://5q9x9srwc6.execute-api.us-east-1.amazonaws.com/prod/challenges/getChallengeById/" +
      questionId;

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(apiUrl, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let jsonResponse = JSON.parse(data.body);
        let ExpectedOutput = jsonResponse.Item.ExpectedOutput;
        currentPoints = parseInt(jsonResponse.Item.points);
        console.log("ExpectedOutput.." + ExpectedOutput);
        console.log("currentPoints.." + currentPoints);

        //---------------------------------------------

        const codeArea = $("#myTextEditor").val();

        const selectedLanguage = $("#lang option:selected").val();
        let lang = "";

        if (selectedLanguage == "java") {
          lang = "j";
        } else if (selectedLanguage == "c") {
          lang = "c";
        } else if (selectedLanguage == "python") {
          lang = "python";
        }

        const body = {
          lang: lang,
          code: codeArea,
        };

        console.log("body.." + JSON.stringify(body));

        const apiUrl =
          "https://5q9x9srwc6.execute-api.us-east-1.amazonaws.com/prod/challenges/execute";

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        };

        fetch(apiUrl, requestOptions)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log("KRish...ata.." + JSON.stringify(data));
            let statusCode = parseInt(data.statusCode)
            console.log("statusCode.."+statusCode);
           if(data.output.includes('error') || data.output.includes('Error') || statusCode !== 200) {
              console.log("inside error..");
              displayErrorMessage(data.output);
            }
            else {
              console.log("outside error..");
            let programOutput = data.output.split("\n");
            let finalOutput = programOutput[0];

            console.log("programOutput.." + programOutput);
            console.log("ExpectedOutput.." + ExpectedOutput);

            if (finalOutput === ExpectedOutput) {
              let displayCalculatedPoints= $('#pointsValue').text(); 
              displayCalculatedPoints += currentPoints;
              console.log('display points... '+displayCalculatedPoints);
              $('#pointsValue').html(displayCalculatedPoints);

              window.alert("Congratulations!! You have earned points!!");
            
              
              // ---------------- points api ------------------
              const pointsUrl =
                "https://5q9x9srwc6.execute-api.us-east-1.amazonaws.com/prod/challenges/updatePoints";

            

              const body = {
                userId: username, 
                points: currentPoints,
                challengedSolved: questionId,
              };

              const requestPointOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
              };

              fetch(pointsUrl, requestPointOptions)
                .then((response) => {
                  console.log("Response.." + JSON.stringify(response));
                  return response.json();
                })
                .then((data) => {
                  console.log("Data.." + JSON.stringify(data));
                  displayData(finalOutput);  
                });
            }
          }
          });
        
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });



  function displayData(programOutput) {
    console.log("inside display function");
    const displayOutputContent = document.getElementById("displayOutput");
    
    let content = "Result... ";
    content += programOutput;
    displayOutputContent.innerHTML = content;
    return programOutput[0];
  }

  function displayErrorMessage(error) {
    console.log('error function');
    const displayOutputContent = document.getElementById("displayOutput");
    displayOutputContent.innerHTML = error;
  }


  //--------------------------------------------- Admin APIs ------------------------------------------------
  //------------------------ create challenge --------------------
  $("#addChallenge").click(function () {
    console.log('inside admin function...');

            var shortDescription =  $("#shortDescription").val();
            var longDescription = $("#longDescription").val();
            var expectedOutput = $("#expectedOutput").val();
            var points = $("#points").val();

            var errorMessageDiv = document.getElementById('errorMessage');

            
            if (shortDescription.trim() === '' || longDescription.trim() === '' || expectedOutput.trim() === '' || points.trim() === '') {
                
              errorMessageDiv.innerHTML = 'Please fill in all the required fields.';
                return false;
            }
          
   
  const adminUrl =
    "https://5q9x9srwc6.execute-api.us-east-1.amazonaws.com/prod/challenges/createChallenge";

  console.log("inside adminurl...");

  const body = {

    shortDescription: shortDescription,
    longDescription: longDescription,
    output: expectedOutput,
    points: points,
  };
  const requestAdminOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  fetch(adminUrl, requestAdminOptions)
    .then((response) => {
      console.log("response..." + JSON.stringify(response));
      return response.json();
    })
    .then((data) => {
      console.log("Data.." + JSON.stringify(data));
      errorMessageDiv.innerHTML = 'Challenge added successfully!!';
      $('#shortDescription').val('')
      $('#longDescription').val('')
      $('#expectedOutput').val('')
      $('#points').val('')
    })
    .catch((error) => {
      console.error("Error:", error);
      errorMessageDiv.innerHTML = 'Error adding challenge. Please try again.';
    });
  })

  // ------------------------ View challenge ------------------------------
  $("#viewChallenge").click(function (){
    location.href = "https://my-app07.s3.us-east-1.amazonaws.com/problems.html#";
  });
  
// --------------------------- Update challenge ---------------------------
$("#updateChallenge").click(function () {
  console.log('inside update function...');
  location.href = "update.html";

})

$("#challengeupdate").click(function (){
console.log('inside update console.log');
const updateUrl =
    "https://5q9x9srwc6.execute-api.us-east-1.amazonaws.com/prod/challenges/update/";

  console.log("inside update...");

  let qid = $('#questionId').val();
  let shortDescription =  $("#shortDescription").val();
  let longDescription = $("#longDescription").val();
  let expectedOutput = $("#expectedOutput").val();
  let points = $("#points").val();

  let showMessage = document.getElementById('showMessage');

  const body = {
    id: qid,
    shortDescription: shortDescription,
    longDescription: longDescription,
    output: expectedOutput,
    points: points,
  };
  const requestAdminOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  fetch(updateUrl, requestAdminOptions)
    .then((response) => {
      console.log("response..." + JSON.stringify(response));
      return response.json();
    })
    .then((data) => {
      console.log("Data.." + JSON.stringify(data));
      $('#shortDescription').val('')
      $('#longDescription').val('')
      $('#expectedOutput').val('')
      $('#points').val('')

      console.log('response data...' +data.status);
      let responseData = JSON.parse(data);
      

      let status = responseData.status;
      console.log("status..." +status);

      if(status === "SUCCESS"){
        showMessage.innerHTML= "Challenge updated successfully!!!";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  })
  

//------------------- global function closure ---------------------
});
