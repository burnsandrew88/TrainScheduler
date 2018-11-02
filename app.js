// Initialize Firebase(Taken from Firebase html Code Generator)



  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBSJro_Qjwf904Ew-hd0vtofrv6y961C8o",
    authDomain: "trainprojectscheduler.firebaseapp.com",
    databaseURL: "https://trainprojectscheduler.firebaseio.com",
    projectId: "trainprojectscheduler",
    storageBucket: "",
    messagingSenderId: "119488914225"
  };
  firebase.initializeApp(config);

  var database = firebase.database();


  var trainName = "";
  var destination = "";
  var startTime = "";
  var frequency = "";

  // display the current time on the jumbotron 

  function currentTime(){
      var current = moment().format('LT');
      $("#currentTime").html(current);
      setTimeout(currentTime, 1000);
  };

  $(".form-control").on("keyup", function (){
      var trainInput = $("#trainName").val().trim();
      var destinationInput = $("#destination").val().trim();
      var timeInput = $("#first-train").val().trim();
      var freqInput = $("#frequency").val().trim();

      sessionStorage.setItem("train", trainInput);
      sessionStorage.setItem("city", destinationInput);
      sessionStorage.setItem("time", timeInput);
      sessionStorage.setItem("freq", freqInput);
  });

  $("#trainName").val(sessionStorage.getItem("train"));
  $("#destination").val(sessionStorage.getItem("city"));
  $("#first-train").val(sessionStorage.getItem("time"));
  $("#frequency").val(sessionStorage.getItem("freq"));

  $("#submitButton").on("click", function(event){
      event.preventDefault();

      if ($("#trainName").val().trim() === "" ||
      $("#destination").val().trim() === "" ||
      $("#first-train").val().trim() === "" ||
      $("#frequency").val().trim() === ""){
          alert("Please fill out entire form to add new train");

      } else{
          trainName = $("#trainName").val().trim();
          destination = $("#destination").val().trim();
          startTime = $("#first-train").val().trim();
          frequency = $("#frequency").val().trim();

          $(".form-control").val("");

          database.ref().push({
              trainName : trainName,
              destination : destination,
              frequency: frequency,
              startTime: startTime,
              datedAdded : firebase.database.ServerValue.TIMESTAMP
          });
          sessionStorage.clear();
      }
      
  });

  // works until here for now

  database.ref().on("child_added",function (childSnapshot){
      var startTimeConverted = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
      var timeDif = moment().diff(moment(startTimeConverted), "minutes");
      var timeRemain = timeDif % childSnapshot.val().frequency;
      var minTo = childSnapshot.val().frequency - timeRemain;
      var nextT = moment().add(minTo, "minutes");

      var newrow = $("<tr>");

      newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
      newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
      newrow.append($("<td>" + childSnapshot.val().frequency + "</td>"));
      newrow.append($("<td>" + moment(nextT).format("LT") + "</td>"));
      newrow.append($("<td>" + minTo + "</td>"));

      if (minTo < 6){
          newrow.addClass("info");
      }
      $("#train-table-rows").append(newrow);
  });

  currentTime();

 

