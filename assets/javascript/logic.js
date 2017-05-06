// Initialize Firebase
var config = {
	apiKey: "AIzaSyB9okKcQ1rWirbqMakxdZZwxpknBR9l6Jk",
	authDomain: "traintracker-47b59.firebaseapp.com",
	databaseURL: "https://traintracker-47b59.firebaseio.com",
	projectId: "traintracker-47b59",
	storageBucket: "traintracker-47b59.appspot.com",
	messagingSenderId: "79435314132"
};
firebase.initializeApp(config);

var db = firebase.database();

// initialize variables
var name = '';
var dest = '';
var time = '';
var freq = 0;
var currentTime;

// when user enters information and clicks on submit button 
//informatin are stored in variables and in the firebase db
$("#submit").on("click", function(event){
	event.preventDefault();

	name = $("#name-input").val().trim();
	dest = $("#dest-input").val().trim();
	time = $("#time-input").val().trim();
	freq = $("#freq-input").val().trim();

	// push
	db.ref("/train").push({
		name: name,
		dest: dest,
		time: time,
		freq: freq

	});

	// clear input
	$("#name-input").val("");
	$("#dest-input").val("");
	$("#time-input").val("");
	$("#freq-input").val("");
});

 
//when a child is added to the database
db.ref("/train").on("child_added", function(snapshot){
	var sv = snapshot.val();
	// start time
	var st = moment(sv.time, "HH:mm").format("HH:mm");
	console.log("**********************");

	console.log('Start Time in military format is: '+st);
	
   // Current Time
    var currentTime = moment().format("HH:mm");
    console.log("Current System Time: "+currentTime);

    // Difference between the times
    var currentMin = moment().format("mm");
    console.log("----------------------")
    var difference = moment.utc(moment(currentTime,"HH:mm").diff(moment(st,"HH:mm"))).format("HH:mm");
 	console.log("Difference between start time and now is: "+difference);
    
    // Time apart (remainder)
    var diffHour = Number(moment(difference, "hh:mm").format("hh"));
    var minutesDifference = Number(moment(difference, "hh:mm").format("mm"));
    //minutes are calculated to find the remainder
    var totalMin = (diffHour*60)+minutesDifference;
    var mod = totalMin%(Number(sv.freq));
    //next train is away in minutes
    var minAway = Number(sv.freq)-mod;
    console.log("-----------------------");
    console.log('Next Train is Away in min: '+minAway);
    //console.log(moment((minAway/60), 'mm').format("hh:mm"))
    var nextTrainTime = moment().add(minAway, 'minutes').format('hh:mm')
    console.log("Train will arrive at "+nextTrainTime);
   // console.log(currentHour*60+currentminutesDifference);

   //  // Minute Until Train

   //  console.log("minutes untill train"+minAway);
   //  // Next Train
   // console.log();

	// var lObj = sv[lkey];
	console.log("-----------------------");
	 console.log("Train Info");
	console.log("Name: "+sv.name);
	console.log("Destination: "+sv.dest);
	console.log("Start Time: "+sv.time);
	console.log("Frequency (min): "+sv.freq);
	console.log("**********************");
	
	
	var tr = $("<tr>");
	tr.append("<td>"+sv.name+"</td>");
	tr.append("<td>"+sv.dest+"</td>");
	
	tr.append("<td>"+sv.freq+"</td>");
	//tr.append("<td>"+sv.time+"</td>");
	tr.append("<td>"+nextTrainTime+"</td>");
	tr.append("<td>"+minAway+"</td>");
	$('#table-body').append(tr);

});


	

