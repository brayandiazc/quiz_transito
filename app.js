document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");
  const performanceList = document.getElementById("performance-list");

  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-btn");

  const questionTitle = document.getElementById("question-title");
  const optionsContainer = document.getElementById("options-container");
  const scoreElement = document.getElementById("score");
  const resultDetails = document.getElementById("result-details");
  const questionCounter = document.createElement("p");

  quizScreen.insertBefore(questionCounter, optionsContainer); // Insertar el contador en la pantalla del cuestionario

  // Mapeo de nombres técnicos a nombres legibles
  const categoryNames = {
    questions_signals: "Señales de tránsito",
    questions_norms: "Normas de tránsito",
    questions_safety: "Seguridad vial",
    questions_mechanics: "Mecánica básica",
    questions_penalties: "Multas y sanciones",
  };

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

  // Actualizar el contador de preguntas
  const updateCounter = () => {
    const remainingQuestions = questions.length - currentQuestionIndex;
    questionCounter.textContent = `Faltan ${remainingQuestions} pregunta(s) por responder.`;
  };

  // Mostrar rendimiento en la pantalla de inicio
  const displayPerformance = () => {
    const performance = JSON.parse(localStorage.getItem("performance")) || {};
    performanceList.innerHTML = ""; // Limpiar contenido previo

    for (const category in performance) {
      const { correct, incorrect } = performance[category];
      const readableCategory = categoryNames[category] || category; // Usar nombre legible
      const listItem = document.createElement("li");
      listItem.textContent = `${readableCategory}: Correctas: ${correct}, Incorrectas: ${incorrect}`;
      performanceList.appendChild(listItem);
    }
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

    updateCounter(); // Actualizar el contador de preguntas
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

    // Guardar el rendimiento en localStorage
    const performance = JSON.parse(localStorage.getItem("performance")) || {};
    if (!performance[category]) {
      performance[category] = { correct: 0, incorrect: 0 };
    }
    // Actualizar las estadísticas de la categoría específica
    performance[category].correct = score;
    performance[category].incorrect = questions.length - score;

    localStorage.setItem("performance", JSON.stringify(performance));

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
    displayPerformance(); // Actualizar el rendimiento al reiniciar
  });

  // Mostrar rendimiento al cargar la página
  displayPerformance();
});
