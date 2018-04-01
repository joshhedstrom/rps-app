// $(document).ready(function() {


const config = {
    apiKey: "AIzaSyA-wBibZXmEuNijBHLwe_2rcgNDwZ1PZE8",
    authDomain: "rps-app-e21df.firebaseapp.com",
    databaseURL: "https://rps-app-e21df.firebaseio.com",
    projectId: "rps-app-e21df",
    storageBucket: "rps-app-e21df.appspot.com",
    messagingSenderId: "155885645294"
};
firebase.initializeApp(config);

const database = firebase.database()

let userOneName;
let userTwoName;

let userOneChoice;
let userTwoChoice;

let onePick;
let twoPick;

let userOnePicked;
let userTwoPicked;

let oneWins;
let twoWins;


let gameCounter;


database.ref("/users").once('value').then(function(snap) {
        if (snap.val() == null) {
            var userOneActive = true;
            var userTwoActive = false;
            database.ref().set({
                users: {
                    userOneName: userOneName,
                    userTwoName: userTwoName,

                    userOneChoice: userOneChoice,
                    userTwoChoice: userTwoChoice,
                    onePick: onePick,
                    twoPick: twoPick,
                    userOnePicked: false,
                    userTwoPicked: false,
                },
                scores: {
                    user1wins: oneWins,
                    user2wins: twoWins,
                    gameCount: gameCounter,
                },
            });
            console.log("found users null")
            $('#playerOneDiv').attr('style', 'display: block;');

        } else if (snap.val().users !== null) {
            updateStats();
            console.log("users not null")
            $('#playerTwoDiv').attr('style', 'display: block;');
        }
    })
    // fullGameLoop();

// $('#submit').click(function(event) {
//    event.preventDefault()

// });



$('#submit').click(function(event) {
    event.preventDefault()
    if (!userOneActive && !userTwoActive) {
        userOneName = $('#nameInput').val().trim();
        // $('#playerOneDiv').attr('style', 'display: block;');
        $('#nameInput').val("");
        console.log("userOneActive")
    } else if (userOneActive && !userTwoActive) {
        userTwoName = $('#nameInput').val().trim();
        // $('#playerTwoDiv').attr('style', 'display: block;');
        $('#nameInput').val("");
        console.log("userTwoActive")
    } else if (userOneActive && userTwoActive) {
        $('#topMessage').text("Sorry, the game is already in use! \n Try again in a few minutes.")
        $('#nameInput').val("");
    }
});

// function fullGameLoop() {

$('#oneRock').click(function() {
    onePick = "rock";
    $('#oneChoice').text(onePick);
    userOnePicked = true;
    check();
});
$('#onePaper').click(function() {
    onePick = "paper";
    $('#oneChoice').text(onePick);
    userOnePicked = true;
    check();
});
$('#oneScissors').click(function() {
    onePick = "scissors";
    $('#oneChoice').text(onePick);
    userOnePicked = true;
    check();
});
$('#twoRock').click(function() {
    twoPick = "rock";
    $('#twoChoice').text(twoPick);
    userTwoPicked = true;
    check();
});
$('#twoPaper').click(function() {
    twoPick = "paper";
    $('#twoChoice').text(twoPick);
    userTwoPicked = true;
    check();
});
$('#twoScissors').click(function() {
    twoPick = "scissors";
    $('#twoChoice').text(twoPick);
    userTwoPicked = true;
    check();
});

function gameLoop(userOneChoice, userTwoChoice) {

    if (userOneChoice === userTwoChoice) {
        tieGame();

    } else if (userOneChoice === "rock" && userTwoChoice === "scissors") {
        userOneWins();

    } else if (userOneChoice === "rock" && userTwoChoice === "paper") {
        userTwoWins();

    } else if (userOneChoice === "paper" && userTwoChoice === "rock") {
        userOneWins();

    } else if (userOneChoice === "paper" && userTwoChoice === "scissors") {
        userTwoWins();

    } else if (userOneChoice === "scissors" && userTwoChoice === "rock") {
        userTwoWins();

    } else if (userOneChoice === "scissors" && userTwoChoice === "paper") {
        userOneWins();

    }
}


function userOneWins() {
    $('.message').text("Player One Wins!")
    oneWins++;
    twoLosses++;
    gameCounter++;
    // updateStats();
    resetGame();
    userOneWinsPicked = false;
    userTwoPicked = false;
}

function userTwoWins() {
    $('.message').text("Player Two Wins!")
    twoWins++;
    oneLosses++;
    gameCounter++;
    // updateStats();
    resetGame();
    userOnePicked = false;
    userTwoPicked = false;
}

function tieGame() {
    $('.message').text("Tie Game!")
    ties++;
    // updateStats();
    resetGame();
    userOnePicked = false;
    userTwoPicked = false;
}


function resetGame() {
    $("#oneChoice, #twoChoice").text("Choose your Weapon!");
    if (gameCounter == 7) {
        $('#gameElement').attr('style', 'display: none;');
        $('.message').text("Thanks for playing! " + userOneName + " had " + oneWins + " wins, and " + userTwoName + " had " + twoWins + " wins.")
    }

}

function userOne() {
    database.ref().on("value", function(snapshot) {
        userTwoName = snapshot.val().users.userTwoName;
        userTwoChoice = snapshot.val().users.userTwoChoice;
        twoPick = snapshot.val().users.twoPick;
        userTwoPicked = snapshot.val().users.userTwoPicked;
        twoWins = snapshot.val().scores.twoWins;
        $("#user1sessionWins").text(userOneName + "'s Wins: " + snapshot.val().scores.user1wins);
        $("#user2sessionWins").text(userTwoName + "'s Wins: " + snapshot.val().scores.user2wins);
        updateStats();
    });
}

function userTwo() {
    database.ref().on("value", function(snapshot) {
        userOneName = snapshot.val().users.userOneName;
        userOneChoice = snapshot.val().users.userOneChoice;
        onePick = snapshot.val().users.onePick;
        userOnePicked = snapshot.val().users.userOnePicked;
        oneWins = snapshot.val().scores.oneWins;
        $("#user1sessionWins").text(userOneName + "'s Wins: " + snapshot.val().scores.user1wins);
        $("#user2sessionWins").text(userTwoName + "'s Wins: " + snapshot.val().scores.user2wins);
        updateStats();
    })
}


function check() {
    if (userOnePicked && userTwoPicked) {
        gameLoop(onePick, twoPick);
    } else {
        $('#message').text("Waiting for the other player's selection...");
    }
}


function updateStats() {
    database.ref().set({
        users: {
            userOneName: userOneName,
            userTwoName: userTwoName,
            userOneChoice: userOneChoice,
            userTwoChoice: userTwoChoice,
            onePick: onePick,
            twoPick: twoPick,
            userOnePicked: userOnePicked,
            userTwoPicked: userTwoPicked,
        },
        scores: {
            user1wins: oneWins,
            user2wins: twoWins,
            tieGames: ties,
            gameCount: gameCounter,
        },
    });
}
// });