$(document).ready(function(){
    var config = {
        apiKey: "AIzaSyBTsD3EmCuXSDnZDRCpziNgusTjbOwUquc",
        authDomain: "train-scheduler-85416.firebaseapp.com",
        databaseURL: "https://train-scheduler-85416.firebaseio.com",
        projectId: "train-scheduler-85416",
        storageBucket: "train-scheduler-85416.appspot.com",
        messagingSenderId: "361013415544"
      };
      firebase.initializeApp(config);

      // A variable to reference the database.
      var database = firebase.database();
  
      // Variables for the onClick event
      var name;
      var destination;
      var firstTrain;
      var frequency = 0;
  
      $("#add-train").on("click", function() {
          event.preventDefault();
          name = $("#train-name").val().trim();
          destination = $("#destination").val().trim();
          firstTrain = $("#first-train").val().trim();
          frequency = $("#frequency").val().trim();
  
          // Info to database
          database.ref().push({
              name: name,
              destination: destination,
              firstTrain: firstTrain,
              frequency: frequency,
              dateAdded: firebase.database.ServerValue.TIMESTAMP
          });
          $("form")[0].reset();
      });
  
      database.ref().on("child_added", function(childSnapshot) {
          var nextArr;
          var minAway;
          var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
          // Difference between the current and firstTrain
          var diffTime = moment().diff(moment(firstTrainNew), "minutes");
          var remainder = diffTime % childSnapshot.val().frequency;
          // Minutes until next train
          var minAway = childSnapshot.val().frequency - remainder;
          // Next train time
          var nextTrain = moment().add(minAway, "minutes");
          nextTrain = moment(nextTrain).format("hh:mm");
  
          $("#add-row").append("<tr><td>" + childSnapshot.val().name +
                  "</td><td>" + childSnapshot.val().destination +
                  "</td><td>" + childSnapshot.val().frequency +
                  "</td><td>" + nextTrain + 
                  "</td><td>" + minAway + "</td></tr>");
  
              // Correct errors
          }, function(errorObject) {
              console.log("Errors handled: " + errorObject.code);
      });
  
      database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
          $("#name-display").html(snapshot.val().name);
          $("#email-display").html(snapshot.val().email);
          $("#age-display").html(snapshot.val().age);
          $("#comment-display").html(snapshot.val().comment);
      });
  });