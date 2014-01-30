$(document).ready(function() {
	var guesses = [];
    var theNumber;
    var bestScore = 9999; //initialize to implausibly high number of guesses
    var UIFadeTime = 1000;

    // Bind button to click event
    $("#guessButton").click(guess);
    $("#resetButton").click(resetGame);
    $(".bestScorePkg").hide();

    // Bind enter key to guess button
    $("#guessBox").keypress(function (e) {
        var key = e.which;
        if(key == 13) { // the enter key code
            $("#guessButton").click();
            return false;  
        }
    });  

    resetGame();

    /********* Functions *********/

    function guess() {
        var num = $("input[name='guess']").val();	
        if(validGuess(num)) {	
            guesses.push(num);
            if(num == theNumber) {                
                endGame();
            }
            else {
                updateScoreboard();
                updateInstruction();
            }
            $("#guessBox").val('');
        }
    }

    function updateScoreboard() {
        $(".currentScore").text(guesses.length);
        $(".lastGuess").text(lastGuess());
        updateHeatLevel();
    }

    function endGame() {
        updateScoreboard();
        if(guesses.length === 1) {   
            fadeText(".instructText", "You win!  On your first guess!?!");
            fadeText(".message", "Go buy a lottery ticket!");
        }
        else {
            fadeText(".instructText", "You win!  You took " + guesses.length + " guesses.");
            fadeText(".message", "Can you do it in " + (guesses.length-1) + "?" );
        }      
        // Update best score
        if (guesses.length < bestScore) { 
            bestScore = guesses.length;    
            fadeText(".bestScore", guesses.length);
            $(".bestScorePkg").fadeIn(UIFadeTime);
        }

        // Hide guess elements
        $("#guessButton, .guess, #resetButton").hide();
        $("#resetButton").fadeOut(Math.floor(UIFadeTime/2), function() {
            $("#resetButton").removeClass("littleButton");
            $("#resetButton").addClass("bigButton");
            $("#resetButton").fadeIn(Math.floor(UIFadeTime));
        });
    }

    function resetGame() {
        // Reset the secret number
        theNumber = Math.floor((Math.random()*100)+1);

        // Clear the guesses array
        guesses.length = 0; 

        // Reset all text boxes
        $(".currentScore").text("0");
        $(".tempText").text("Ice Cold");
        $(".instructText").text("I'm thinking of a number between 1 and 100.");
        $(".message").text("Take your best shot!");
        $(".lastGuess").text(" - ");

        // Reset colors
        $(".viewport").animate({backgroundColor: jQuery.Color("rgb(0,0,255)")}, 1000);
        $(".tempText").animate({color: jQuery.Color("rgb(0,0,255)")}, 1000);

        // Make reset button little again
        $("#resetButton").removeClass("bigButton");
        $("#resetButton").addClass("littleButton");

        // Show guess elements
        $("#guessButton, .guess").fadeIn(UIFadeTime);
    }

    function updateHeatLevel() { 
        var diff = currentDiff();
        switch (true) { 
            case (diff === 0):
                fadeText(".tempText", "On Fire!");
                break;
            case (diff < 3):
                fadeText(".tempText", "Red Hot");
                break;
            case (diff < 6):
                fadeText(".tempText", "Toasty");
                break;
            case (diff < 11):
                fadeText(".tempText", "Warm");
                break;
            case (diff < 21):
                fadeText(".tempText", "Cool");
                break;
            case (diff < 31):
                fadeText(".tempText", "Chilly");
                break;   
            default:   
                fadeText(".tempText", "Ice Cold");
                break;             
        }

        //Calculate background color
        var redness;
        if (diff > 10) {
            redness = 0;
        }
        else {
            redness = Math.floor(((10 - diff) * 200) / 10) + 55;
        }
        var blueness;
        if (diff <= 10) {
            blueness = 0;
        }
        else if (diff > 30) {
            blueness = 255;
        }        
        else {
            blueness = Math.floor(((diff - 10) * 200) / 20) + 55;
        }

        //https://github.com/jquery/jquery-color
        var jColor = jQuery.Color ( "rgb(" + redness + " ," + 0 + "," + blueness + ")" );
        
        //http://stackoverflow.com/questions/2652281/jquery-fade-in-background-colour
        $(".viewport").animate({backgroundColor: jColor}, UIFadeTime);
        $(".tempText").animate({color: jColor}, 0);
    }

    function updateInstruction() {
        if (currentDiff() > lastDiff()) {
            fadeText(".instructText", "You are getting colder.");
        }
        else if (currentDiff() < lastDiff()) {
            fadeText(".instructText", "You are getting warmer.");
        }
        else {
            fadeText(".instructText", "Nope.");
        }

        fadeText(".message", "Guess again.");
    }

    function validGuess(num) {
        if(isNaN(num) || num < 1 || num > 100) {
            fadeText(".message", "Guess a number between 1 and 100.");
            return false;
        }        
        return true;
    }

    function fadeText(selector, textToWrite) {
        $(selector).fadeOut(Math.floor(UIFadeTime/2), function() {
            $(selector).text(textToWrite);
            $(selector).fadeIn(Math.floor(UIFadeTime/2));
        });
    }

    function lastGuess() {
       return guesses[guesses.length-1];
    }

    function currentDiff() {
       return Math.abs(theNumber - lastGuess());
    }

    function lastDiff() {
        if (guesses.length <= 1)
            return 100;
        else
            return Math.abs(theNumber - guesses[guesses.length-2]);
    }
});
