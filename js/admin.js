
  //--------------------------------------------- Admin APIs ------------------------------------------------
  //------------------------ create challenge --------------------
  $(document).ready(function () {

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
    
    
   // getting CREATE_USER_API_ENDPOINT from constants.js file
  let adminUrl = CREATE_CHALLENGE_API_ENDPOINT;

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

// getting UPDATE_CHALLENGE_API_ENDPOINT from constants.js file
const updateUrl = UPDATE_CHALLENGE_API_ENDPOINT;

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
  

});
