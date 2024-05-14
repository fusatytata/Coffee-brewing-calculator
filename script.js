let beansInput = document.querySelector("#beans");
let ratioInput = document.querySelector("#ratio");
let waterInput = document.querySelector("#water");
let yieldInput = document.querySelector("#yield");
let timerInput = document.querySelector("#timer");
let remainInput = document.querySelector("#remain");
let startButton = document.querySelector("#startButton");
let stopButton = document.querySelector("#stopButton");
let resetButton = document.querySelector("#resetButton");
let progressBar = document.querySelector("#progress-bar"); 

const calculator = () => {
    waterInput.value = Math.round(beansInput.value * ratioInput.value * 100) / 100; //calc.fc. + two decimal places
    yieldInput.value = Math.round(waterInput.value * 0.9 * 100) / 100; //calc.fc. + two decimal places
};

beansInput.addEventListener("input", () => {
    calculator();
});

ratioInput.addEventListener("input", () => {
    calculator();
});

let timerInterval;
let remainingMinutes = 0; // Initialize to zero
let remainingSeconds = 0; // Initialize to zero

let formattedTime = () => {
    let formattedTime =
        (remainingMinutes < 10 ? "0" : "") +
        remainingMinutes +
        ":" +
        (remainingSeconds < 10 ? "0" : "") +
        remainingSeconds;

    remainInput.value = formattedTime;

    // Update progress bar value
    progressBar.style.width = (100 - (remainingMinutes + (remainingSeconds / 60)) * 100 / timerInput.value) + "%";
};

let start = () => {
    if (!timerInterval) {
        let minutes = timerInput.value;
        remainingMinutes = Math.floor(minutes);
        remainingSeconds = Math.round((minutes - remainingMinutes) * 60);
    }
    timerInterval = setInterval(function () {
        if (remainingSeconds > 0 || remainingMinutes > 0) {
            remainingSeconds--;

            if (remainingSeconds < 0) {
                remainingSeconds = 59;
                remainingMinutes--;
            }

            formattedTime();
        } else {
            stop();
        }
    }, 1000);
};

let reset = () => {
    clearInterval(timerInterval);
    timerInterval = null;
    let minutes = timerInput.value;
    remainingMinutes = Math.floor(minutes);
    remainingSeconds = Math.round((minutes - remainingMinutes) * 60);
    formattedTime();
};

let stop = () => {
    clearInterval(timerInterval);
    timerInterval = null;
};

stopButton.addEventListener("click", stop);
startButton.addEventListener("click", start);
resetButton.addEventListener("click", reset);

timerInput.addEventListener("input", reset);

const beforeSunriseElement = document.querySelector("#before-sunrise");
const forenoonElement = document.querySelector("#forenoon");
const middayElement = document.querySelector("#midday");
const eveningElement = document.querySelector("#evening");
const afterSunsetElement = document.querySelector("#after-sunset");

new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
})
    .then(({ coords: { latitude, longitude } }) => fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=today`))
    .then(res => res.json())
    .then(({ status, results }) => {
        if (status !== "OK") throw status;
        return results;
    })
    .then(({ civil_twilight_begin, civil_twilight_end }) => {
        let now = new Date(); 
        let dawn = new Date(civil_twilight_begin);
        let dusk = new Date(civil_twilight_end); 

        let elementToBeShown;

        switch (true) {
            case now < dawn:
                elementToBeShown = beforeSunriseElement; // before sunrise
                break;
            case now.getHours() < 10:
                elementToBeShown = forenoonElement; // forenoon (after sunrise)
                break;
            case now > dusk:
                elementToBeShown = afterSunsetElement; // after sunset
                break;
            case now.getHours() >= 16:
                elementToBeShown = eveningElement; // evening (before sunset)
                break;
            default:
                elementToBeShown = middayElement; // midday, afternoon
                break;
        }
    
        elementToBeShown.removeAttribute("hidden");
    })
    .catch(error => console.log("Daytime infobox fetch failed", error));
      

