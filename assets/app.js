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

    let oneActive = false;
    let twoActive = false;

    //USER-------------------------------------------------------------------------------------------------

    database.ref().once("value", function(snap) {
        if (snap.val().users.oneActive == false) {
            database.ref('users/oneActive').set(true);
            $('#playerOneDiv').attr('style', 'display: block;');
            oneActive = true;

        } else if (snap.val().users.twoActive == false) {
            database.ref('users/twoActive').set(true);
            $('#playerTwoDiv').attr('style', 'display: block;');
            twoActive = true;

        } else if (snap.val().users.oneActive == true && snap.val().users.twoActive == true) {
            $('#topMessage').text("Sorry, the game is already in use.\n Please try again later.")
        }
    })

    //NAME----------------------------------------------------------------------------------------------------

    $('#submit').click(function(event) {
        event.preventDefault()
        if (oneActive) {
            let name = $('#nameInput').val().trim();
            database.ref('users/oneName').set(name);
            // $('#playerOneDiv').attr('style', 'display: block;');
            $('#startElement').attr('style', 'display: none');
            // $('#nameInput').val("");
        } else if (twoActive) {
            let name = $('#nameInput').val().trim();
            database.ref('users/twoName').set(name);
            // $('#playerTwoDiv').attr('style', 'display: block;');
            $('#startElement').attr('style', 'display: none');
            // $('#nameInput').val("");
        }
    });

    //CLICK FUNCTIONS-----------------------------------------------------------------------------------------

    $('#oneRock').click(function() {
        $('#oneChoice').text("Rock");
        database.ref('users/onePick').set('r');
        database.ref('users/userOnePicked').set(true);
        check();
    });
    $('#onePaper').click(function() {
        $('#oneChoice').text("Paper");
        database.ref('users/onePick').set('p');
        database.ref('users/userOnePicked').set(true);
        check();
    });
    $('#oneScissors').click(function() {
        $('#oneChoice').text('Scissors');
        database.ref('users/onePick').set('s');
        database.ref('users/userOnePicked').set(true);
        check();
    });
    $('#twoRock').click(function() {
        $('#twoChoice').text("Rock");
        database.ref('users/twoPick').set('r');
        database.ref('users/userTwoPicked').set(true);
        check();
    });
    $('#twoPaper').click(function() {
        $('#twoChoice').text("Paper");
        database.ref('users/twoPick').set('p');
        database.ref('users/userTwoPicked').set(true);
        check();
    });
    $('#twoScissors').click(function() {
        $('#twoChoice').text('Scissors');
        database.ref('users/twoPick').set('s');
        database.ref('users/userTwoPicked').set(true);
        check();
    });

    //CHECK STATUS--------------------------------------------------------------------------------------------

    function check() {
        database.ref().once("value", function(snap) {
            if (snap.val().users.userOnePicked && snap.val().users.userTwoPicked) {
                gameLoop(snap.val().users.onePick, snap.val().users.twoPick);
            }
        })
    }

    //GAME LOOP-----------------------------------------------------------------------------------------------

    function gameLoop(userOneChoice, userTwoChoice) {
        if (userOneChoice === userTwoChoice) {
            tieGame();
        } else if (userOneChoice === 'r' && userTwoChoice === 's') {
            userOneWins();
        } else if (userOneChoice === 'r' && userTwoChoice === 'p') {
            userTwoWins();
        } else if (userOneChoice === 'p' && userTwoChoice === 'r') {
            userOneWins();
        } else if (userOneChoice === 'p' && userTwoChoice === 's') {
            userTwoWins();
        } else if (userOneChoice === 's' && userTwoChoice === 'r') {
            userTwoWins();
        } else if (userOneChoice === 's' && userTwoChoice === 'p') {
            userOneWins();
        }
        return;
    }

    //RESULT FUNCTIONS----------------------------------------------------------------------------------------

    function userOneWins() {
        $('#wonMessage').text("Player One Wins!")
        database.ref().once('value', function(snap) {
            let score = snap.val().scores.oneWins;
            let count = snap.val().scores.gameCounter;
            score++;
            count++;
            database.ref('scores/oneWins').set(score);
            database.ref('scores/gameCounter').set(count);

        })
        resetGame();
    }

    function userTwoWins() {
        $('#wonMessage').text("Player Two Wins!")
        database.ref().once('value', function(snap) {
            let score = snap.val().scores.twoWins;
            let count = snap.val().scores.gameCounter;
            score++;
            count++;
            database.ref('scores/twoWins').set(score);
            database.ref('scores/gameCounter').set(count);
        })
        resetGame();
    }

    function tieGame() {
        $('#wonMessage').text("Tie Game!")
        database.ref().once('value', function(snap) {
            let score = snap.val().scores.ties;
            score++;
            database.ref('scores/ties').set(score);
        })
        resetGame();
    }

    //RESET GAME----------------------------------------------------------------------------------------------

    function resetGame() {
        database.ref('users/userOnePicked').set(false);
        database.ref('users/userTwoPicked').set(false);
        database.ref().once("value", function(snap) {
            $("#user1sessionWins").text(snap.val().users.oneneName + "'s Wins: " + snap.val().scores.oneWins);
            $("#user2sessionWins").text(snap.val().users.twoName + "'s Wins: " + snap.val().scores.twoWins);
            $('#gameCounter').text("Rounds Played: " + snap.val().scores.gameCounter);
            if (snap.val().scores.gameCounter === 3) {
                endGame();
            }
        })
        $("#oneChoice, #twoChoice").text("Choose your Weapon!");
    }

    //END GAME------------------------------------------------------------------------------------------------

    function endGame() {
        $('#gameElement').attr('style', 'display: none;');
        database.ref().once("value", function(snap) {
            $('#topMessage').text("Thanks for playing! " + snap.val().users.oneName + " had " + snap.val().scores.oneWins + " wins, and " + snap.val().users.twoName + " had " + snap.val().scores.twoWins + " wins.")
            database.ref('users/oneActive').set(false);
            database.ref('users/twoActive').set(false);

        })
    }

    //ON VALUE CHANGE-----------------------------------------------------------------------------------------

    database.ref('scores/oneWins').on("value", function(snap) {
        // $("#user1sessionWins").text(snap.val().users.oneName + "'s Wins: " + snap.val().scores.oneWins);
        // $("#user2sessionWins").text(snap.val().users.userTwoName + "'s Wins: " + snap.val().scores.twoWins);
        // $('#gameCounter').text("Rounds Played: " + snap.val().scores.gameCounter);

        $('#wonMessage').text("Player One Wins!");
    });

    database.ref('scores/twoWins').on("value", function(snap) {
        // $("#user1sessionWins").text(snap.val().users.userOneName + "'s Wins: " + snap.val().scores.oneWins);
        // $("#user2sessionWins").text(snap.val().users.twoName + "'s Wins: " + snap.val().scores.twoWins);
        // $('#gameCounter').text("Rounds Played: " + snap.val().scores.gameCounter);
        // 
        $('#wonMessage').text("Player Two Wins!");
    });

    database.ref('scores/ties').on("value", function(snap) {
        // $("#user1sessionWins").text(snap.val().users.userOneName + "'s Wins: " + snap.val().scores.oneWins);
        // $("#user2sessionWins").text(snap.val().users.userTwoName + "'s Wins: " + snap.val().scores.twoWins);
        // $('#gameCounter').text("Rounds Played: " + snap.val().scores.gameCounter);

        $('#wonMessage').text("Tie Game!");
    });

    //ON WINDOW CLOSE-----------------------------------------------------------------------------------------

    $(window).on("unload", function(e) {
        e.preventDefault()
        database.ref().set({
            users: {
                oneActive: false,
                twoActive: false,
            },
            scores: {
                oneWins: 0,
                twoWins: 0,
                ties: 0,
                gameCounter: 0,
            }
        });
    });

});