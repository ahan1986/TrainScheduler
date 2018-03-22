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

var trainName;
var destinationName;
var firstTrainName;
var frequencyName;

$("#submit").on("click", function () {
    event.preventDefault();
    // created a loading gif. Hides everything in the body where train times are displayed
    $("#refresher").html("<img src='assets/loading.gif'>");
    // stop function to stop the constant updating of the "minutes away" column
    stop()
    $("thead, tbody").hide();

    //after 3 seconds, the loading gif will go away and start the continues updating of the "minutes away" column
    setTimeout(function () {
        $("#refresher").html("");
        $("thead, tbody").show();
    }, 3000);

    //user has to put in information that is greater than one in each field
    if ($("#destinationName, #frequencyName").val() > 1) { 

    };
        trainName = $("#trainName").val();
        destinationName = $("#destinationName").val();
        firstTrainName = $("#firstTrainName").val();
        frequencyName = $("#frequencyName").val();

        // if the user adds a 3 digit time, this will convert the value by adding 0 in front of it. e.g 300 will give us a value 0300.  This is because I was having issues using moment.js with only 3 digit military time
        if ($("#firstTrainName").val().length === 3) {
            var addZero = [0];
            addZero.push($("#firstTrainName").val());
            firstTrainName = addZero.join('');
            console.log(firstTrainName);
        }

        database.ref().push({
            trainName: trainName,
            destinationName: destinationName,
            firstTrainName: firstTrainName,
            frequencyName: frequencyName
        })

        //restarting the constant updating every second.
        oneSecondCountdownToRefresh();
    
    //clearing out the values in the input textboxes
    $("#trainName").val("");
    $("#destinationName").val("");
    $("#firstTrainName").val("");
    $("#frequencyName").val("");

})

//calling intervalId so that there will be no bugs...not sure what again but I remember something hapened in class without it
var intervalId;

// calling this function to refresh the content every 1 minute
function refresh() {
    //empties the content everytime it refreshes so that the new content can go up
    $("#refresh").empty();

    //grabbing information from firebase and creating a variable for each child
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
        // I've created this if statement when the user adds for the first train time. the frequency added for the first time that is very close to the current time will give a negative value.  So I am flipping the equation to give a positive number which will provide a positive "minutesAway" value.  So pretty much without this, the math above will not work.
        if (firstTrainMinusCurrentTime < dbfrequencyName) {
            minutesAway = dbfrequencyName - firstTrainMinusCurrentTime
        }
        minutesAway = minutesLeftForNextTrain;

        //appending all the results and data into the html
        $("#trainTable > tbody").append("<tr><td>" + dbName + "</td><td>" + dbDestination + "</td><td>" + dbfrequencyName + "</td><td>" + dbnextArrival + "</td><td>" + minutesAway + "</td></tr>");

    });
} //======= end of refresh function =====

//setInterval to call the refresh function every second
function oneSecondCountdownToRefresh() {
    intervalId = setInterval(refresh, 1000);
}
oneSecondCountdownToRefresh();
// function to stop the constant updating
function stop() {
    clearInterval(intervalId);
}