var trainName;
var destinationName;
var firstTrainName;
var frequencyName;

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA994Np653NXUCpQ0ymP0jNKCkfaaJfFiU",
    authDomain: "timescheduler-afa27.firebaseapp.com",
    databaseURL: "https://timescheduler-afa27.firebaseio.com",
    projectId: "timescheduler-afa27",
    storageBucket: "timescheduler-afa27.appspot.com",
    messagingSenderId: "82488578649"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

$("#submit").on("click", function(){
    event.preventDefault();
    trainName = $("#trainName").val();
    destinationName = $("#destinationName").val();
    firstTrainName = $("#firstTrainName").val();
    frequencyName = $("#frequencyName").val();

    database.ref().push({
        trainName: trainName,
        destinationName: destinationName,
        firstTrainName: firstTrainName,
        frequencyName: frequencyName
    })
    console.log(trainName);

    //clearing out the values in the input textboxes
    $("#trainName").val("");
    $("#destinationName").val("");
    $("#firstTrainName").val("");
    $("#frequencyName").val("");
})

database.ref().on("child_added", function(childSnapShot, prevChildKey) {

    var dbName = childSnapShot.val().trainName;
    var dbDestination = childSnapShot.val().destinationName;
    var dbfirstTrainName = childSnapShot.val().firstTrainName;
    var dbfrequencyName = childSnapShot.val().frequencyName;

        //current time
        var timeNow = moment().format("HH:mm");
        console.log(timeNow);

        //setting a variable for firstTrain time input in moment.js
        var firstTrain = moment(dbfirstTrainName, "HH:mm").format("HH:mm");
        console.log(firstTrain);

//7:00 - now in minutes
        var a = moment().diff(moment(firstTrain, "HH:mm"), "minutes");
        console.log(a);
        
       var b = a % dbfrequencyName;
       console.log(b);
       // minutes left until next arrival
       var d = dbfrequencyName - b;
       console.log(d);

       // when the next train should come in military time format
       var c = moment(timeNow, "HH:mm").add(d, "minutes").format("HH:mm");
       console.log(c);
    

        //current time plus the frequency that was inputed
        var dbnextArrival = moment(c, "HH:mm").format("LT");
     

        var minutesAway;

        if (a < dbfrequencyName) {
           minutesAway = dbfrequencyName - a
        }
        minutesAway = d;


    $("#trainTable > tbody").append("<tr><td>"+dbName+"</td><td>"+dbDestination+"</td><td>"+ dbfrequencyName+"</td><td>"+ dbnextArrival+"</td><td>"+ minutesAway +"</td></tr>");

});

