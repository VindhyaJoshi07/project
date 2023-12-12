$("#displayChallenge").click(function () {
  let username = $("#userName").val();
  location.href = "https://my-app07.s3.us-east-1.amazonaws.com/problems.html#" + username;
});


  //// ---------------------- Submit Challenge -----------------------
  $("#submitChallenge").click(function () {
    //1.fetch question info ExpectedOutput, question Points.

    let currentPoints = '';
    let questionId = $("#questionId").val();
    let username = $("#userName").val();
    const apiUrl = GET_CHALLENGES_BY_ID_API_ENDPOINT + questionId;

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

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        };

        fetch(EVALUATE_CHELLENGE_API_ENDPOINT, requestOptions)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            let statusCode = parseInt(data.statusCode)
           if(data.output.includes('error') || data.output.includes('Error') || statusCode !== 200) {
              displayErrorMessage(data.output);
            }
            else {
            let programOutput = data.output.split("\n");
            let finalOutput = programOutput[0];


            if (finalOutput === ExpectedOutput) {
           
              let displayCalculatedPoints= parseInt($('#pointsValue').text()); 
              displayCalculatedPoints += currentPoints;
              $('#pointsValue').html(displayCalculatedPoints);
              window.alert("Congratulations!! You have earned points!!");
            
              
              // ---------------- points api ------------------
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

              fetch(UPDATE_POINTS_API_ENDPOINT, requestPointOptions)
                .then((response) => {
                  return response.json();
                })
                .then((data) => {
                  displayData(finalOutput);  
                });
            }
          }
          });
        
      })
      .catch((error) => {
        alert("Error:", error);
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