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

let userOneName = "";
let userTwoName = "";

let userOneChoice = "";
let userTwoChoice = "";

let onePick = "";
let twoPick = "";

let userOnePicked = false;
let userTwoPicked = false;

let oneWins = 0;
let twoWins = 0;
let gameCounter = 0;
let oneActive = false;

database.ref("/users").once('value').then(function(snap) {
    if (snap.val() == null) {
        oneActive = true;
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
        return;

    } else if (snap.val().users !== null) {
        updateStats();
        console.log("users not null")
        $('#playerTwoDiv').attr('style', 'display: block;');
        return;
    }
    return;
})

$('#submit').click(function(event) {
    event.preventDefault()
    if (oneActive) {
        userOneName = $('#nameInput').val().trim();
        // $('#playerOneDiv').attr('style', 'display: block;');
        $('#nameInput').val("");
        console.log("userOneActive")
        userOne();
    } else if (!oneActive) {
        userTwoName = $('#nameInput').val().trim();
        // $('#playerTwoDiv').attr('style', 'display: block;');
        $('#nameInput').val("");
        console.log("userTwoActive")
        userTwo();
    }
    // else if (userOneActive && userTwoActive) {
    //     $('#topMessage').text("Sorry, the game is already in use! \n Try again in a few minutes.")
    //     $('#nameInput').val("");
    // }
});

$('#oneRock').click(function() {
    onePick = "rock";
    $('#oneChoice').text(onePick);
    userOnePicked = true;
    userOne();
    check();
    // updateStats();
});
$('#onePaper').click(function() {
    onePick = "paper";
    $('#oneChoice').text(onePick);
    userOnePicked = true;
    userOne();
    check();
    // updateStats();
});
$('#oneScissors').click(function() {
    onePick = "scissors";
    $('#oneChoice').text(onePick);
    userOnePicked = true;
    userOne();
    check();
    // updateStats();
});
$('#twoRock').click(function() {
    twoPick = "rock";
    $('#twoChoice').text(twoPick);
    userTwoPicked = true;
    userTwo();
    check();
    // updateStats();
});
$('#twoPaper').click(function() {
    twoPick = "paper";
    $('#twoChoice').text(twoPick);
    userTwoPicked = true;
    userTwo();
    check();
    // updateStats();
});
$('#twoScissors').click(function() {
    twoPick = "scissors";
    $('#twoChoice').text(twoPick);
    userTwoPicked = true;
    userTwo();
    check();
    // updateStats();
});

//----------------------------------------------------------------------------------------------
//game functions

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
    gameCounter++;
    userOneWinsPicked = false;
    userTwoPicked = false;
    resetGame();
}

function userTwoWins() {
    $('.message').text("Player Two Wins!")
    twoWins++;
    gameCounter++;
    userOnePicked = false;
    userTwoPicked = false;
    resetGame();
}

function tieGame() {
    $('.message').text("Tie Game!")
    userOnePicked = false;
    userTwoPicked = false;
    resetGame();
}

function check() {
    console.log("check")
    if (userOnePicked && userTwoPicked) {
        gameLoop(onePick, twoPick);
    } else {
        $('#message').text("Waiting for the other player's selection...");
    }
    updateStats();
}

function resetGame() {
    console.log("reset game")
    onePick = "";
    twoPick = "";
    $("#oneChoice, #twoChoice").text("Choose your Weapon!");
    if (gameCounter == 7) {
        $('#gameElement').attr('style', 'display: none;');
        $('.message').text("Thanks for playing! " + userOneName + " had " + oneWins + " wins, and " + userTwoName + " had " + twoWins + " wins.")
    }
    updateStats();
}

//--------------------------------------------------------------------------------------------------------

function userOne() {
    database.ref().on("value", function(snapshot) {
        check();
        console.log("changing 1")
        userTwoName = snapshot.val().users.userTwoName;
        userTwoChoice = snapshot.val().users.userTwoChoice;
        twoPick = snapshot.val().users.twoPick;
        userTwoPicked = snapshot.val().users.userTwoPicked;
        twoWins = snapshot.val().scores.user2wins;
        $("#user1sessionWins").text(userOneName + "'s Wins: " + snapshot.val().scores.user1wins);
        $("#user2sessionWins").text(userTwoName + "'s Wins: " + snapshot.val().scores.user2wins);
    });
    updateStats();
    // return;
}

function userTwo() {
    database.ref().on("value", function(snapshot) {
        check();
        console.log("changing 2")
        userOneName = snapshot.val().users.userOneName;
        userOneChoice = snapshot.val().users.userOneChoice;
        onePick = snapshot.val().users.onePick;
        userOnePicked = snapshot.val().users.userOnePicked;
        oneWins = snapshot.val().scores.user1wins;
        $("#user1sessionWins").text(userOneName + "'s Wins: " + snapshot.val().scores.user1wins);
        $("#user2sessionWins").text(userTwoName + "'s Wins: " + snapshot.val().scores.user2wins);
    });
    updateStats();
    return;
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
            gameCount: gameCounter,
        },
    });
    return;
}
// });