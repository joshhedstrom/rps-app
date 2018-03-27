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

let userOneActive = false;
let userTwoActive = false;

let userOneName;
let userTwoName;

let userOneChoice;
let userTwoChoice;

let onePick;
let twoPick;

let userOnePicked = false;
let userTwoPicked = false;

let oneWins = 0;
let oneLosses = 0;
let twoWins = 0;
let twoLosses = 0;
let ties = 0;

let rock;
let paper;
let scissors;

let gameCounter = 0;


function onStart() {
    database.ref("users").once('value', function(snap) {
        console.log(snap);
        if (snap.val() == null) {
            updateAllStats();
            userOneActive = snap.val().users.userOneActive;
            userTwoActive = snap.val().users.userTwoActive;

            console.log("updated all stats")

        } else if (snap.val().users !== null) {
            // userOneActive = snap.val().users.userOneActive;
            // userTwoActive = snap.val().users.userTwoActive;
            updateAllStats();

            console.log("updated active")
        }
    })

}
onStart();



$('#submit').click(function() {
    if (!userOneActive && !userTwoActive) {
        userOneName = $('#nameInput').val().trim();
        userOneActive = true;
        $('#playerOneDiv').attr('style', 'display: block;');
        $('#nameInput').val("");
        updateAllStats();
        console.log("userOneActive")
    } else if (userOneActive && !userTwoActive) {
        userTwoName = $('#nameInput').val().trim();
        userTwoActive = true;
        $('#playerTwoDiv').attr('style', 'display: block;');
        $('#nameInput').val("");
        // updateStats();
        console.log("userTwoActive")
    } else if (userOneActive && userTwoActive) {
        $('#topMessage').text("Sorry, the game is already in use! \n Try again in a few minutes.")
        $('#nameInput').val("");
    }
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
    resetGame();
    updateStats();
    userOnePicked = false;
    userTwoPicked = false;
}

function userTwoWins() {
    $('.message').text("Player Two Wins!")
    twoWins++;
    oneLosses++;
    gameCounter++;
    resetGame();
    updateStats();
    userOnePicked = false;
    userTwoPicked = false;
}

function tieGame() {
    $('.message').text("Tie Game!")
    ties++;
    updateStats();
    resetGame();
    userOnePicked = false;
    userTwoPicked = false;
}


function resetGame() {
    $("#oneChoice, #twoChoice").text("Choose your Weapon!");
    if (gameCounter == 7) {
        $('.message').text("Thanks for playing! " + userOneName + " had " + oneWins + " wins, and " + userTwoName + " had " + twoWins + " wins.")
    }

}


function updateAllStats() {
    database.ref().set({
        users: {
            userOneActive: userOneActive,
            userTwoActive: userTwoActive,
        },
        scores: {
            user1wins: oneWins,
            user1losses: oneLosses,
            user2wins: twoWins,
            user2losses: twoLosses,
            tieGames: ties,
            gameCount: gameCounter,
        },
    });
}

function updateStats() {
    database.ref().set({
        scores: {
            user1wins: oneWins,
            user1losses: oneLosses,
            user2wins: twoWins,
            user2losses: twoLosses,
            tieGames: ties,
            gameCount: gameCounter,
        },
    });
}

updateStats();

database.ref().on("value", function(snapshot) {
    $("#user1sessionWins").text(userOneName + "'s session Wins: " + snapshot.val().scores.user1wins)
    $("#user1sessionLosses").text(userOneName + "'s session Losses: " + snapshot.val().scores.user1losses)
    $("#user2sessionWins").text(userTwoName + "'s session Wins: " + snapshot.val().scores.user2wins)
    $("#user2sessionLosses").text(userTwoName + "'s session Losses: " + snapshot.val().scores.user2losses)
    // userOneActive = snapshot.val().users.userOneActive;
    // userTwoActive = snapshot.val().users.userTwoActive;
    // console.log(snapshot)
});



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


function check() {
    if (userOnePicked && userTwoPicked) {
        gameLoop(onePick, twoPick);
    } else {
        $('#message').text("Waiting for the other player's selection...");
    }
}

// });