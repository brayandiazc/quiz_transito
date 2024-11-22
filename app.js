document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");

  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-btn");

  const questionTitle = document.getElementById("question-title");
  const optionsContainer = document.getElementById("options-container");
  const scoreElement = document.getElementById("score");

  let username = "";
  let category = "";
  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;

  // Cargar preguntas desde JSON
  const loadQuestions = (category) => {
    return fetch(`data/${category}.json`)
      .then((response) => response.json())
      .catch((error) => console.error("Error al cargar preguntas:", error));
  };

  // Iniciar el cuestionario
  startBtn.addEventListener("click", async () => {
    username = document.getElementById("username").value;
    category = document.getElementById("category").value;

    if (!username.trim()) {
      alert("Por favor, ingresa tu nombre.");
      return;
    }

    questions = await loadQuestions(category);
    currentQuestionIndex = 0;
    score = 0;

    startScreen.style.display = "none";
    quizScreen.style.display = "block";
    showQuestion();
  });

  // Mostrar la pregunta actual
  const showQuestion = () => {
    const question = questions[currentQuestionIndex];
    questionTitle.textContent = question.question;
    optionsContainer.innerHTML = "";

    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () =>
        selectAnswer(option, question.answer)
      );
      optionsContainer.appendChild(button);
    });

    nextBtn.disabled = true;
  };

  // Seleccionar respuesta
  const selectAnswer = (selectedOption, correctAnswer) => {
    const buttons = optionsContainer.querySelectorAll("button");
    buttons.forEach((button) => {
      if (button.textContent === correctAnswer) {
        button.classList.add("correct");
      } else if (button.textContent === selectedOption) {
        button.classList.add("incorrect");
      }
      button.disabled = true;
    });

    if (selectedOption === correctAnswer) {
      score++;
    }
    nextBtn.disabled = false;
  };

  // Avanzar a la siguiente pregunta
  nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  });

  // Finalizar el cuestionario
  const endQuiz = () => {
    quizScreen.style.display = "none";
    resultScreen.style.display = "block";
    scoreElement.textContent = `${username}, tu puntaje final es ${score}/${questions.length}`;
  };

  // Reiniciar el cuestionario
  restartBtn.addEventListener("click", () => {
    resultScreen.style.display = "none";
    startScreen.style.display = "block";
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");

  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-btn");

  const questionTitle = document.getElementById("question-title");
  const optionsContainer = document.getElementById("options-container");
  const scoreElement = document.getElementById("score");
  const resultDetails = document.getElementById("result-details");

  let username = "";
  let category = "";
  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let userAnswers = []; // Almacena las respuestas del usuario

  // Cargar preguntas desde JSON
  const loadQuestions = (category) => {
    return fetch(`data/${category}.json`)
      .then((response) => response.json())
      .catch((error) => console.error("Error al cargar preguntas:", error));
  };

  // Iniciar el cuestionario
  startBtn.addEventListener("click", async () => {
    username = document.getElementById("username").value;
    category = document.getElementById("category").value;

    if (!username.trim()) {
      alert("Por favor, ingresa tu nombre.");
      return;
    }

    questions = await loadQuestions(category);
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = []; // Reiniciar las respuestas del usuario

    startScreen.style.display = "none";
    quizScreen.style.display = "block";
    showQuestion();
  });

  // Mostrar la pregunta actual
  const showQuestion = () => {
    const question = questions[currentQuestionIndex];
    questionTitle.textContent = question.question;
    optionsContainer.innerHTML = "";

    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () =>
        selectAnswer(option, question.answer)
      );
      optionsContainer.appendChild(button);
    });

    nextBtn.disabled = true;
  };

  // Seleccionar respuesta
  const selectAnswer = (selectedOption, correctAnswer) => {
    const buttons = optionsContainer.querySelectorAll("button");
    buttons.forEach((button) => {
      if (button.textContent === correctAnswer) {
        button.classList.add("correct");
      } else if (button.textContent === selectedOption) {
        button.classList.add("incorrect");
      }
      button.disabled = true;
    });

    // Guardar respuesta del usuario
    userAnswers.push({
      question: questions[currentQuestionIndex].question,
      selected: selectedOption,
      correct: correctAnswer,
      isCorrect: selectedOption === correctAnswer,
    });

    if (selectedOption === correctAnswer) {
      score++;
    }
    nextBtn.disabled = false;
  };

  // Avanzar a la siguiente pregunta
  nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  });

  // Finalizar el cuestionario y mostrar resultados
  const endQuiz = () => {
    quizScreen.style.display = "none";
    resultScreen.style.display = "block";

    // Mostrar puntaje
    scoreElement.textContent = `${username}, tu puntaje final es ${score}/${questions.length}`;

    // Generar resumen de respuestas
    resultDetails.innerHTML = ""; // Limpiar contenido anterior
    userAnswers.forEach((answer, index) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("result-item");

      const questionText = document.createElement("p");
      questionText.textContent = `Pregunta ${index + 1}: ${answer.question}`;

      const selectedAnswer = document.createElement("p");
      selectedAnswer.textContent = `Tu respuesta: ${answer.selected}`;
      selectedAnswer.style.color = answer.isCorrect ? "green" : "red";

      const correctAnswer = document.createElement("p");
      correctAnswer.textContent = `Respuesta correcta: ${answer.correct}`;
      correctAnswer.style.color = "green";

      resultItem.appendChild(questionText);
      resultItem.appendChild(selectedAnswer);
      resultItem.appendChild(correctAnswer);

      resultDetails.appendChild(resultItem);
    });
  };

  // Reiniciar el cuestionario
  restartBtn.addEventListener("click", () => {
    resultScreen.style.display = "none";
    startScreen.style.display = "block";
  });
});
