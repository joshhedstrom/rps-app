$(document).ready(function() {

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


    $('#submit').click(function() {
        if (!userOneActive) {
           userOneName = $('#nameInput').val().trim();
           userOneActive = true;
        } else if(userOneActive && !userTwoActive) {
            userTwoName = $('#nameInput').val().trim();
            userTwoActive = true;
        } else if( userOneActive && userTwoActive) {
            $('.message').text("Sorry, the game is already in use! \n Try again in a few minutes.")
        }
    });



    function gameStart() {
        if (!userOneActive) {
            userOneActive = true;
        } else if (userOneActive) {
            userTwoActive = true;
            $('#gameElement').attr('style', 'display: block;');
        }
    }


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
            // $("#user1totalWins").text(userOneName + "'s total Wins: " + snapshot.scores.)
            // $("#user1totalLosses").text(userOneName + "'s total Losses: " + snapshot.scores.)
            // $("#user2totalWins").text(userTwoName + "'s total Wins: " + snapshot.scores.)
            // $("#user2totalLosses").text(userTwoName + "'s total Losses: " + snapshot.scores.)
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

});