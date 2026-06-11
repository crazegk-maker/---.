let currentQuestionIndex = 0;
let score = 0;
let questions = [];

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress');
const quizContainer = document.getElementById('quiz-container');
const resultSection = document.getElementById('result-section');
const finalScoreText = document.getElementById('final-score');
const questionSection = document.getElementById('question-section');

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        startQuiz();
    } catch (error) {
        console.error("Ошибка загрузки вопросов:", error);
        questionText.innerText = "Ошибка загрузки вопросов. Запустите через локальный сервер.";
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    progressText.innerText = `Вопрос ${currentQuestionIndex + 1} из ${questions.length}`;
    progressFill.style.width = `${((currentQuestionIndex) / questions.length) * 100}%`;

    questionText.innerText = currentQuestion.question;
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.onclick = () => selectAnswer(option, button, currentQuestion.answer);
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(selectedOption, clickedButton, correctAnswer) {
    if (selectedOption === correctAnswer) {
        score++;
        clickedButton.classList.add('correct');
    } else {
        clickedButton.classList.add('wrong');
        const allButtons = optionsContainer.querySelectorAll('button');
        allButtons.forEach(btn => {
            if (btn.innerText === correctAnswer) {
                btn.classList.add('correct');
            }
        });
    }

    const allButtons = optionsContainer.querySelectorAll('button');
    allButtons.forEach(btn => btn.disabled = true);

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1200);
}

function showResults() {
    questionSection.classList.add('hidden');
    document.querySelector('.header').classList.add('hidden');
    resultSection.classList.remove('hidden');
    finalScoreText.innerText = `Вы набрали ${score} из ${questions.length}`;
}

loadQuestions();