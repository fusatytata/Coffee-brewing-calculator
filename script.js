let beansInput = document.querySelector("#beans");
let ratioInput = document.querySelector("#ratio");
let waterInput = document.querySelector("#water");
let yieldInput = document.querySelector("#yield");
let timerInput = document.querySelector("#timer");
let remainInput = document.querySelector("#remain");
let startButton = document.querySelector("#startButton");
let stopButton = document.querySelector("#stopButton");
let resetButton = document.querySelector("#resetButton");
let progressBar = document.querySelector("#myBar");
let coffeeOrNot= document.querySelector("#coffeeOrNot");

const calculator = () => {
    waterInput.value = Math.round(beansInput.value * ratioInput.value * 100) / 100; //calc.fc. + two decimal places
    yieldInput.value = Math.round(waterInput.value * 0.9 * 100) / 100; //calc.fc. + two decimal places
};

beansInput.addEventListener("input", () => {
    console.log(beansInput.value);
    calculator();
});

ratioInput.addEventListener("input", () => {
    console.log(ratioInput.value);
    calculator();
});

let timerInterval;
let remainingMinutes;
let remainingSeconds;
let randomFact;

let formattedTime = () => {
    let formattedTime =
        (remainingMinutes < 10 ? "0" : "") +
        remainingMinutes +
        ":" +
        (remainingSeconds < 10 ? "0" : "") +
        remainingSeconds;

    remainInput.value = formattedTime;

    progressBar.value = 100 - (remainingMinutes + (remainingSeconds / 60) * 100) / timerInput.value;
};

let start = () => {
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
    let minutes = timerInput.value;
    remainingMinutes = Math.floor(minutes);
    remainingSeconds = Math.round((minutes - remainingMinutes) * 60);
    formattedTime();
    stop();
};

let stop = () => {
    clearInterval(timerInterval);
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
        let now = new Date(); //zde se dá uděla fake údaj, a tím si vyzkoušet funkčnost switche
        let dawn = new Date(civil_twilight_begin); //zde se dá uděla fake rozbřesk, a tím si vyzkoušet funkčnost switche
        let dusk = new Date(civil_twilight_end); ////zde se dá uděla fake soumrak, a tím si vyzkoušet funkčnost switche

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
      

// přepsat switch tak, aby to bylo seřazeno chronologicky - ale fungovalo to stejně = všude bude stejné znaménko, ne současný bordel