

var startEl = document.querySelector("#welcome");
var startQuizBtnEl = document.querySelector("#startQuiz");
var quizEl = document.querySelector("#quiz");
var questionEl = document.querySelector("#question");
var answersEl = document.querySelector("#answers");
var inputScoreEl = document.querySelector("#inputScore");
var initialsEl = document.querySelector("#initials");
var submitInitialsBtnEl = document.querySelector("#submitInitials");
var userScoreEl = document.querySelector("#score");
var highScoresEl = document.querySelector("#highScores");
var scoresEl = document.querySelector("#scores");
var goBackBtnEl = document.querySelector("#goBack");
var clearScoresBtnEl = document.querySelector("#clearScores");
var viewHScoresBtnEl = document.querySelector("#viewHScores");
var timerEl = document.querySelector("#timer");
var score = 0;
var currentQuestion = 0;
var highScores = [];
var interval;
var timeAllowed = 75;
var secondsElapsed = 0;


function startTimer() {
    timerEl.textContent = timeAllowed;
    interval = setInterval(function () {
        secondsElapsed++;
        timerEl.textContent = timeAllowed - secondsElapsed;
        if (secondsElapsed >= timeAllowed) {
            currentQuestion = questions.length;
            nextQuestion();
        }
    }, 1000);
}


function stopTimer() {
    clearInterval(interval);
}


function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        stopTimer();
        if ((timeAllowed - secondsElapsed) > 0)
            score += (timeAllowed - secondsElapsed);
        userScoreEl.textContent = score;
        hide(quizEl);
        show(inputScoreEl);
        timerEl.textContent = 0;
    }
}


function checkAnswer(answer) {
    if (questions[currentQuestion].answer == questions[currentQuestion].choices[answer.id]) {
        score += 5;
        displayMessage("Correct!");
    }
    else {
        secondsElapsed += 10;
        displayMessage("Wrong...");
    }
}


function displayMessage(m) {
    let messageHr = document.createElement("hr");
    let messageEl = document.createElement("div");
    messageEl.textContent = m;
    document.querySelector(".jumbotron").appendChild(messageHr);
    document.querySelector(".jumbotron").appendChild(messageEl);
    setTimeout(function () {
            messageHr.remove();
            messageEl.remove();
    }, 1000);

}

function hide(element) {
    element.style.display = "none";
}
function show(element) {
    element.style.display = "block";
}
function reset() {
    score = 0;
    currentQuestion = 0;
    secondsElapsed = 0;
    timerEl.textContent = 0;
}
function showQuestion() {
    questionEl.textContent = questions[currentQuestion].title;
    for (i = 0; i < answersEl.children.length; i++) {
        answersEl.children[i].children[0].textContent = `${(i + 1)}: ${questions[currentQuestion].choices[i]}`;
    }
}

function renderHighScores() {
    
    scoresEl.innerHTML = "";
    show(highScoresEl);
    highScores = JSON.parse(localStorage.getItem("scores"));
    for (let i = 0; i < highScores.length; i++) {
        let scoreItem = document.createElement("div");
        scoreItem.className += "row mb-3 p-2";
        console.log(scoreItem)
        scoreItem.setAttribute("style", "background-color:PaleTurquoise;");
        scoreItem.textContent = `${(i + 1)}. ${highScores[i].username} - ${highScores[i].userScore}`;
        scoresEl.appendChild(scoreItem);
    }
}

viewHScoresBtnEl.addEventListener("click", function () {
    hide(startEl);
    hide(quizEl);
    hide(inputScoreEl);
    renderHighScores();
    stopTimer();
    reset();
});

startQuizBtnEl.addEventListener("click", function () {
    hide(startEl);
    startTimer();
    showQuestion();
    show(quizEl);
});

answersEl.addEventListener("click", function (e) {
    if (e.target.matches("button")) {
        checkAnswer(e.target);
        nextQuestion();
    }
});


submitInitialsBtnEl.addEventListener("click", function () {
    let initValue = initialsEl.value.trim();
    if (initValue) {
        let userScore = { username: initValue, userScore: score };
        initialsEl.value = '';
        highScores = JSON.parse(localStorage.getItem("scores")) || [];
        highScores.push(userScore)
        localStorage.setItem("scores", JSON.stringify(highScores));
        hide(inputScoreEl);
        renderHighScores();
        reset();
    }
});


goBackBtnEl.addEventListener("click", function () {
    hide(highScoresEl);
    show(startEl);
});


clearScoresBtnEl.addEventListener("click", function () {
    highScores = [];
    localStorage.setItem("scores", JSON.stringify(highScores));
    renderHighScores();
});

