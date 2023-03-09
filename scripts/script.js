import data from './data.js'

const screensDuration = 2000;

let timeSpended = 0;
let countCorrectAnswers = 0;
const timeSpendedIntervalId = setInterval(() => timeSpended++, 1000);

let selectedOption;
let currentQuestionNum = 0;
let currentQuestion = data.questions[currentQuestionNum];

const quizForm = document.querySelector('.quiz');
const optionsContainer = quizForm.querySelector('.quiz__options');

optionsContainer.addEventListener('click', function(e) {
  const target = e.target;
  const id = target.dataset.id;

  if(id) {
    selectedOption = id;
    checkButton.removeAttribute('disabled');
    quizForm.querySelector('.selected-option').textContent = target.textContent;

    optionsContainer.querySelectorAll('.quiz__option').forEach(el => {
      el.classList.remove('quiz__option--selected');
    })

    target.classList.add('quiz__option--selected');
  }
})

function loadQuestion(question) {
  quizForm.querySelector('.selected-option').textContent = '';
  checkButton.setAttribute('disabled', 'true');

  const {question : questionTxt, options} = question;

  quizForm.querySelector('.quiz__question').textContent = questionTxt;

  optionsContainer.innerHTML = '';
  options.forEach((option, i) => {
    optionsContainer.insertAdjacentHTML('beforeend', `
      <button class="quiz__option transition-all duration-300 text-lg md:text-xl hover:bg-white hover:text-black py-4 px-1" data-id=${i}>${option}</button>
    `)
  })
}


const checkButton = quizForm.querySelector('.quiz__check-btn');
checkButton.addEventListener('click', function() {
  checkUserAnswer(selectedOption)
})

function checkUserAnswer(selectedOption) {

  const isCorrect = typeof currentQuestion.answer == 'object' // has multiple answers ?
  ? currentQuestion.answer.includes(+selectedOption)
  : currentQuestion.answer == selectedOption;
  
  if(isCorrect) countCorrectAnswers++

  if(currentQuestionNum + 1 >= data.questions.length) finish();
  else {

    isCorrect
    ? showScreen(document.querySelector('.correct-screen'), screensDuration)
    : showScreen(document.querySelector('.incorrect-screen'), screensDuration);

    currentQuestion = data.questions[++currentQuestionNum];
    loadQuestion(currentQuestion);
    selectedOption = undefined;
  }

}

function finish() {
  clearInterval(timeSpendedIntervalId);

  const finishScreen = document.querySelector('.finish-screen');

  finishScreen.querySelector('.info__correct-answers').textContent = countCorrectAnswers;
  finishScreen.querySelector('.info__count-questions').textContent = data.questions.length;
  finishScreen.querySelector('.info__time-spended').textContent = timeSpended - (screensDuration / 1000) * data.questions.length - 1;

  finishScreen.querySelector('.repeat-btn').onclick = () => location.reload();

  showScreen(finishScreen, 0, true);
}

function showScreen(screenEl, duration, isInsane = false) {
  quizForm.classList.add('hidden');

  screenEl.classList.remove('hidden');

  if(!isInsane) {  
    setTimeout(() => {
      screenEl.classList.add('hidden');
      quizForm.classList.remove('hidden');
    }, duration)
  }
}

loadQuestion(currentQuestion);