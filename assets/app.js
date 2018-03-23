// $(document).ready(function() {


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
    $('#message').text("Player One Wins!")
    oneWins++;
    twoLosses++;
    gameCounter++;
    resetGame();
    updateStats();
    userOnePicked = false;
    userTwoPicked = false;

}

function userTwoWins() {
    $('#message').text("Player Two Wins!")
    twoWins++;
    oneLosses++;
    gameCounter++;
    resetGame();
    updateStats();
    userOnePicked = false;
    userTwoPicked = false;

}

function tieGame() {
    $('#message').text("Tie Game!")
    ties++;
    resetGame();
    updateStats();
    userOnePicked = false;
    userTwoPicked = false;

}

function resetGame() {

}

function updateStats(scoreOne, scoreTwo, ties) {
    //session update user 1 wins/losses
    //session update user 2 wins/losses
    //master update user 1 wins/losses
    //master update user 2 wins/losses
    //update if tie 
}

$('#oneRock').click(function() {
    onePick = "rock";
    userOnePicked = true;
    check();
});
$('#onePaper').click(function() {
    onePick = "paper";
    userOnePicked = true;
    check();
});
$('#oneScissors').click(function() {
    onePick = "scissors";
    userOnePicked = true;
    check();
});
$('#twoRock').click(function() {
    twoPick = "rock";
    userTwoPicked = true;
    check();
});
$('#twoPaper').click(function() {
    twoPick = "paper";
    userTwoPicked = true;
    check();
});
$('#twoScissors').click(function() {
    twoPick = "scissors";
    userTwoPicked = true;
    check();
});

function check() {
    if (userOnePicked && userTwoPicked) {
        gameLoop(onePick, twoPick);
    }
    else {
        $('#message').text("Waiting for the other player's selection...")
    }
}


    // });