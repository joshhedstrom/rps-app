// $(document).ready(function() {


let userOneChoice;
let userTwoChoice;

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

    } else if (userOneChoice === rock || userTwoChoice === scissors) {
        userOneWins();

    } else if (userOneChoice === rock || userTwoChoice === paper) {
        userTwoWins();

    } else if (userOneChoice === paper || userTwoChoice === rock) {
        userOneWins();

    } else if (userOneChoice === paper || userTwoChoice === scissors) {
        userTwoWins();

    } else if (userOneChoice === scissors || userTwoChoice === rock) {
        userTwoWins();

    } else if (userOneChoice === scissors || userTwoChoice === paper) {
        userOneWins();

    }
}


function userOneWins() {
    $('#message').text("Player One Wins!")
    oneWins++;
    twoLosses++;
    gameCounter++;
    resetGame();

}

function userTwoWins() {
    $('#message').text("Player Two Wins!")
    twoWins++;
    oneLosses++;
    gameCounter++;
    resetGame();

}

function tieGame() {
    $('#message').text("Tie Game!")
    ties++;
    resetGame();

}

function resetGame() {

}



// });