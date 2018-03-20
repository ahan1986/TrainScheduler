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

$("#submit").on("click", function () {
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

    //clearing out the values in the input textboxes
    $("#trainName").val("");
    $("#destinationName").val("");
    $("#firstTrainName").val("");
    $("#frequencyName").val("");
})

database.ref().on("child_added", function (childSnapShot, prevChildKey) {

    var dbName = childSnapShot.val().trainName;
    var dbDestination = childSnapShot.val().destinationName;
    var dbfirstTrainName = childSnapShot.val().firstTrainName;
    var dbfrequencyName = childSnapShot.val().frequencyName;

    //current time
    var timeNow = moment().format("HH:mm");

    //setting a variable for firstTrain time input in moment.js
    var firstTrain = moment(dbfirstTrainName, "HH:mm").format("HH:mm");

    //using moment.js to get the difference between the current time and the first train time that was added by the user.
    var firstTrainMinusCurrentTime = moment().diff(moment(firstTrain, "HH:mm"), "minutes");

    //Once first cycle of the frequency has passed, this will get the remainder. Meaning: this will get the minutes that has passed the first frequency.
    var minutesThatPassedFreq = firstTrainMinusCurrentTime % dbfrequencyName;

    // Subtracting the remainder from above with the frequency of that inputed to give the remaining minutes left until the next train to arrive
    var minutesLeftForNextTrain = dbfrequencyName - minutesThatPassedFreq;

    // when the next train should come in military time format
    var nextTrainTimeInMilitary = moment(timeNow, "HH:mm").add(minutesLeftForNextTrain, "minutes").format("HH:mm");

    //current time plus the frequency that was inputed
    var dbnextArrival = moment(nextTrainTimeInMilitary, "HH:mm").format("LT");


    var minutesAway;
    // I've created this if statement when the user adds for thefirst train time.  Without this, the math above will not work.
    if (firstTrainMinusCurrentTime < dbfrequencyName) {
        minutesAway = dbfrequencyName - firstTrainMinusCurrentTime
    }
    minutesAway = minutesLeftForNextTrain;

    //appending all the results and data into the html
    $("#trainTable > tbody").append("<tr><td>" + dbName + "</td><td>" + dbDestination + "</td><td>" + dbfrequencyName + "</td><td>" + dbnextArrival + "</td><td>" + minutesAway + "</td></tr>");

});

