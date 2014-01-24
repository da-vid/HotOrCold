$(document).ready(function() {

	var guesses = [];
    var theNumber;
    var bestScore = 9999;
    var UIFadeTime = 500;
    resetGame();
    
  //   $('.productHeadline').hide();
  //   $('.productArrow').hide();

  //   // Set day of week
  //   var day = dayOfWeek();
  //   $('.headerHappyDay').text("Happy " + day + ".");


    // Bind button to click event
    $("#guessButton").click(guess);
    $("#resetButton").click(resetGame);
    $(".bestScorePkg").hide();

    function guess() {
        var num = $("input[name='guess']").val();	
        if(validGuess(num)) {	
            guesses.push(num);
            if(num == theNumber) 
                endGame();
            else
                updateScoreboard();
        }
    }

    function updateScoreboard() {
        $(".currentScore").text(guesses.length);
        $(".lastGuess").text(lastGuess());
        updateHeatLevel();
        updateInstruction();
    }

    function endGame() {
        //Disable further guessing
        //Show final score
        //
        updateHeatLevel();
        $(".currentScore").text(guesses.length);
        $(".instruct").text("You win!  You took " + guesses.length + " guesses.");
        $(".message").text("Can you do it in " + (guesses.length-1) + "?" );

        if (guesses.length < bestScore) { 
            bestScore = guesses.length;           
            $(".bestScore").text(guesses.length);
            $(".bestScorePkg").fadeIn(UIFadeTime);
        }
        $("#guessButton, .guessBox, .lastGuessPkg").fadeOut(UIFadeTime);


    }

    function resetGame() {
       theNumber = Math.floor((Math.random()*100)+1);
       guesses.length = 0; //clear the guesses array
       $(".currentScore").text("0");
       $(".temp").text("Ice Cold");
       $(".instruct").text("I'm thinking of a number between 1 and 100.");
       $(".message").text("What is your guess?");
       $(".viewport").animate({backgroundColor: jQuery.Color("rgb(0,0,255)")}, 1000);
       $(".temp").animate({color: jQuery.Color("rgb(0,0,255)")}, 1000);
       $("#guessButton, .guessBox, .lastGuessPkg").fadeIn(UIFadeTime);
    }

    function updateHeatLevel() { 
        var diff = currentDiff();
        switch (true) { //http://stackoverflow.com/questions/5619832/switch-on-ranges-of-integers-in-javascript
            case (diff === 0):
                $(".temp").text("On Fire!");
                break;
            case (diff < 3):
                $(".temp").text("Red Hot");
                break;
            case (diff < 6):
                $(".temp").text("Toasty");
                break;
            case (diff < 11):
                $(".temp").text("Warm");
                break;
            case (diff < 21):
                $(".temp").text("Cool");
                break;
            case (diff < 31):
                $(".temp").text("Chilly");
                break;   
            default:   
                $(".temp").text("Ice Cold");
                break;             
        }
        var redness;
     
        if (diff > 10) {
            redness = 0;
        }
        else {
            redness = Math.floor((10 - diff) * 255 / 10);
        }

        var blueness;
        if (diff <= 10) {
            blueness = 0;
        }
        else if (diff > 30) {
            blueness = 255 ;
        }
        else {
            blueness = Math.floor(((diff - 10) * 255) / 20);
        }
        //https://github.com/jquery/jquery-color
        var jColor = jQuery.Color ( "rgb(" + redness + " ," + 0 + "," + blueness + ")" );
        //http://stackoverflow.com/questions/2652281/jquery-fade-in-background-colour
        $(".viewport").animate({backgroundColor: jColor}, 1000);
        $(".temp").animate({color: jColor}, 1000);
    }

    function updateInstruction() {
        if (currentDiff() > lastDiff())
            $(".instruct").text("You are getting colder.");
        else if (currentDiff() < lastDiff())
            $(".instruct").text("You are getting warmer.");
        else
            $(".instruct").text("Nope.");

        $(".message").text("Guess again.");
    }

    function validGuess(num) {
        if(isNaN(num) || num < 1 || num > 100) {
            $(".message").text("Please enter a number between 1 and 100.");
            return false;
        }        
        return true;
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
