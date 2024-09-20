var buttonColours = ["red", "blue", "green", "yellow"];
var userClickedPattern = [];
var gamePattern = [];
var keyCounter = 0;
var bestScore = 0;

var level = 0;

$(document).ready(function() {
    const savedScore = localStorage.getItem('bestScore');
    if (savedScore !== null) {
        bestScore = parseInt(savedScore, 10);
        $("#best-score").text(bestScore); // Display the best score
    }
});

$(document).keydown(function() {
    $("#level-title").text("Level 1");
    $("#high-score-overlay").fadeOut(200);

    setTimeout(() => {
        while (keyCounter == 0) {   
            nextSequence();
            keyCounter++;
        }
    }, 700);
});

$(".btn").click(function() {
    var userChosenColour = $(this).attr('id');
    userClickedPattern.push(userChosenColour);
    console.log(userClickedPattern);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
});

function nextSequence() {
    $("#score-text").text("Your score!").removeClass("glow");
    userClickedPattern = [];
    level += 1;

    $("#level-title").text("Level " + level);
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    playSequence(gamePattern);
}

function playSequence(sequence) {
    $("#overlay").show();
    let delay = 0;
    sequence.forEach(function(colour) {
        setTimeout(function() {
            $("#" + colour).fadeIn(100).fadeOut(100).fadeIn(100);
            playSound(colour);
        }, delay);
        delay += 600;
    });

    setTimeout(function() {
        $("#overlay").hide();
    }, delay);
}

function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(currentColour) {
    $("#" + currentColour).addClass('pressed');

    setTimeout(() => {
        $("#" + currentColour).removeClass('pressed');
    }, 100);
}

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        console.log("success");

        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(() => {
                nextSequence();
            }, 1000);
        }
    } else {
        console.log("wrong");
        playSound("wrong");

        $("body").addClass("game-over");
        setTimeout(() => {
            $("body").removeClass("game-over");
        }, 200);

        $("#level-title").text("Press Any Key to Restart");
        
        setTimeout(() => {
            highScore();
        }, 800);

        setTimeout(() => {
            startOver();
        }, 900);
    }
}

function startOver() {
    level = 0;
    gamePattern = [];
    keyCounter = 0;
}

function highScore() {
    $("#score").text(level - 1);
    $("#high-score-overlay").fadeIn(500);

    if ((level - 1) > bestScore) {
        bestScore = level - 1;
        localStorage.setItem('bestScore', bestScore);
        
        $("#best-score").text(bestScore);
        $("#score-text").text("New best score!").addClass("glow");

        playSound("bestscore");
        playVideo();
    }
}

function playVideo() {
    setTimeout(() => {
        $("#confetti-video").fadeIn(500);
    }, 400);

    $("#confetti-video")[0].play();

    setTimeout(() => {
        $("#confetti-video").fadeOut(800);
    }, 4000);
}
