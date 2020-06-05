let timerObj = {
    minutes: 0,
    seconds: 0,
    timerId: 0
}

function soundAlarm() {
    let amount = 3; // How many times the alarm will ring
    let audio = new Audio('Timer_Sound_Effect.mp3');
    function playSound() {
        audio.pause(); // First we need to stop the audio, then bring the current time to 0, then play the audio.
        audio.currentTime = 0;
        audio.play();
    }

    for(let i = 0; i < amount; i++) {
        setTimeout(playSound, 1200 * i);
    }
}


function updateValue(key, value) {
    if(value < 0) {
        value = 0;
        console.log("Positive Numbers Only, Please.");
    }
// If the value of seconds is less than 10 ie 9 it should be saved as 09.
    if(key == "seconds") {
        if(value < 10) {
            value = "0" + value;
        }
// If the value of seconds is greater than 59 make it as 59.
        if(value > 59) {
            value = 59;
        }
    }
// To display changes on the HTML end.
    $("#" + key).html(value || 0);
    timerObj[key] = value;
}

// This function runs for one time in the beginning.
(function detectChanges(key) {
    let input = "#" + key + "-input";

    $(input).change(function() {
        updateValue(key, $(input).val());
    });

    $(input).keyup(function() {
        updateValue(key, $(input).val());
    });
    return arguments.callee;
})("minutes")("seconds");
//keydown - The key is on its way down, keypress - The key is pressed down, keyup - The key is released
//arguments.callee - an anonymous function (which can be created by a function expression or the Function constructor) does not have a name. Therefore if there is no accessible variable referring to it, the only way the function can refer to itself is by arguments.callee.

function startTimer() {
    buttonManager(["start", false], ["pause", true], ["stop", true]);
    freezeInputs();
// If minutes is not 0 then bring seconds to 59 and minutes to minutes-1.
    timerObj.timerId = setInterval(function() {
        timerObj.seconds--;
        if(timerObj.seconds < 0) {
            if(timerObj.minutes == 0) {
                soundAlarm();
                return stopTimer();
            }
            timerObj.seconds = 59;
            timerObj.minutes--;
        }

        updateValue("minutes", timerObj.minutes);
        updateValue("seconds", timerObj.seconds);
    }, 1000);

}


function stopTimer() {
    clearInterval(timerObj.timerId);
    buttonManager(["start", true], ["pause", false], ["stop", false]);
    unfreezeInputs();
    updateValue("minutes", $("#minutes-input").val());

    // The seconds will by default be undefined.  Expliclty setting the seconds to 0 will prevent formats such as 1:0 or 2:0 when the timer expires, where the correct format should be 1:00 or 2:00.
    let seconds = $("#seconds-input").val() || "0";
    updateValue("seconds", seconds);
}


function pauseTimer() {
    buttonManager(["start", true], ["pause", false], ["stop", true]);
    clearInterval(timerObj.timerId);
}


// The array will be an array of button states.  Each state consist of the name of the button and the state.  If the state is true, then the button is enabled.
function buttonManager(...buttonsArray) {
    for(let i = 0; i < buttonsArray.length; i++) {
        let button = "#" + buttonsArray[i][0] + "-button";
        if(buttonsArray[i][1]) {
            $(button).removeAttr('disabled');
        } else {
            $(button).attr('disabled', 'disabled');
        }
    }
}

// Called from start timer.
function freezeInputs() {
    $("#minutes-input").attr('disabled', 'disabled');
    $("#seconds-input").attr('disabled', 'disabled');
}


// Called from stop timer.
function unfreezeInputs() {
    $("#minutes-input").removeAttr('disabled');
    $("#seconds-input").removeAttr('disabled');
}
