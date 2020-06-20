const quiz = new Quiz();
let responses = "";
let correctAnswer = "";
let incorrectAnswer = [];
const anserSelecter = document.querySelector('#ans-checker');
let reset_form = document.querySelector(".reset_form");

let correctAnswerCount = (localStorage.getItem('quiz_correct_answ')) ? localStorage.getItem('quiz_correct_answ') : 0,
    incorrectAnswerCount = (localStorage.getItem('quiz_incorrect_answ')) ? localStorage.getItem('quiz_incorrect_answ') : 0;

document.addEventListener("DOMContentLoaded", function(e) {

    setTimeout(function(e) {
        document.querySelector(".hidden").remove();
    }, 1000);

    loadQuestionsApi();
    eventListener();

});


eventListener = () => {
    anserSelecter.addEventListener('click', validateAnswer);
}

loadQuestionsApi = function() {

    quiz.fetchQuestions().then(function(data) {

        responses = data.response.results;
        displayQuestion(responses);

    }).catch(function(err) {
        console.log(err);
    });
}

const displayQuestion = function(data) {

    //console.log(data);

    const diffLevel = document.querySelector('.level');

    if (data[0].difficulty === "hard") {
        diffLevel.style.color = "red";
    } else if (data[0].difficulty === "medium") {
        diffLevel.style.color = "black";
    } else {
        diffLevel.style.color = "blue";
    }

    diffLevel.innerHTML = `<p> Difficulty level: ${data[0].difficulty}</p>`;

    const questionHTML = document.createElement('div');
    questionHTML.classList.add('col-12');
    questionHTML.innerHTML = `
        <h2 class="text-center">
          ${data[0].question}
        </h2>
        `;
    //add category to the class
    const category = document.querySelector(".category");
    category.innerHTML = `
        <p>Question category :  ${data[0].category}</p>
        <div class="totals">
          <span class="badge badge-success">${correctAnswerCount}</span>
          <span class="badge badge-danger">${incorrectAnswerCount}</span>
        </div>`;

    data.forEach(function(question) {
        correctAnswer = question.correct_answer;
        incorrectAnswer = question.incorrect_answers;
        //place the answer into the array using the random sequence approach
        incorrectAnswer.splice(Math.floor(Math.random() * 3), 0, correctAnswer);
    });

    const answerDiv = document.createElement('div');
    answerDiv.classList.add('questions', 'row', 'justify-content-around', 'mt-4');

    incorrectAnswer.forEach(function(answers) {

        const answershTML = document.createElement('li');
        answershTML.classList.add('col-12', 'col-md-5');
        answershTML.textContent = answers;
        answershTML.style.cursor = "pointer";

        //select the answers on the page
        answershTML.onclick = selectAnswers;
        answerDiv.appendChild(answershTML);
    });
    questionHTML.appendChild(answerDiv);
    document.querySelector('#app').appendChild(questionHTML);
}

/**
 * Select answer function to the question desployed on the page
 */
function selectAnswers(e) {
    const selectedAnswer = document.querySelector('.active');
    if (selectedAnswer) {
        selectedAnswer.classList.remove('active');
    }
    e.target.classList.add('active');
}

function validateAnswer(e) {

    const selectedAnswer = document.querySelector('.questions .active');

    if (selectedAnswer) {
        checkCorrectAnswer();
    } else {
        const invalidMsg = document.createElement("div");
        invalidMsg.classList.add('alert', 'alert-danger', 'col-md-6', 'mt-4');
        invalidMsg.textContent = "Please at least one of the answers ";
        const questionDiv = document.querySelector('.questions');

        if (document.querySelector('.alert-danger')) {
            document.querySelector('.alert-danger').remove();
        }

        questionDiv.appendChild(invalidMsg);

        setTimeout(function() {
            questionDiv.appendChild(invalidMsg).remove();
        }, 2000);
    }
}

const checkCorrectAnswer = () => {

    const answer = document.querySelector("li.active").textContent;

    if (correctAnswer === answer) {
        correctAnswerCount++;

    } else {

        incorrectAnswerCount++;
        console.log(incorrectAnswerCount);
    }

    //save record into the 

    saveAnswerlocalstorage();

    //remove the previous object and reload api function again
    const apps = document.querySelector("#app .col-12");

    if (apps) {
        apps.remove();
    }

    //load api questions 
    loadQuestionsApi();
    resetForms();

}

const saveAnswerlocalstorage = () => {
    localStorage.setItem("quiz_correct_answ", correctAnswerCount);
    localStorage.setItem("quiz_incorrect_answ", incorrectAnswerCount);
}

const resetForms = () => {
    localStorage.setItem("quiz_correct_answ", 0);
    localStorage.setItem("quiz_incorrect_answ", 0);

    setTimeout(() => {
        window.location.reload();
    }, 500);
}