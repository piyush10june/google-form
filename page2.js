// =====================================
// BLUEBERRY ASTROVASTU
// PAGE 2 - FIVE ELEMENTS QUIZ
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    const radios = document.querySelectorAll('input[type="radio"]');

    radios.forEach(radio => {

        radio.addEventListener("change", function () {

            updateScore();         // Five Elements
            updatePlanetScore();   // Planet Quiz
            updateGunaScore();     // Guna Quiz
            updateElementBalanceScore(); // Element Balance
            updatePrakritiTableScore();   // <-- ADD THIS

        });
    });

});

updateScore();
updatePlanetScore();
updateGunaScore();
updateElementBalanceScore(); // Element Balance



// =====================================
// UPDATE SCORE
// =====================================

function updateScore() {

    let score = {
        Air: 0,
        Fire: 0,
        Earth: 0,
        Space: 0,
        Water: 0
    };

    document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        score[radio.value]++;
    });

    document.getElementById("airScore").textContent = score.Air + " /25";
    document.getElementById("fireScore").textContent = score.Fire + " /25";
    document.getElementById("earthScore").textContent = score.Earth + " /25";
    document.getElementById("spaceScore").textContent = score.Space + " /25";
    document.getElementById("waterScore").textContent = score.Water + " /25";



    // Save answers

    const answers = {};

    for (let i = 1; i <= 25; i++) {

        const selected = document.querySelector(
            'input[name="fe_q' + i + '"]:checked'
        );

        answers["fe_q" + i] = selected ? selected.value : "";

    }

    answers.air = parseInt(document.getElementById("airScore").textContent);
    answers.fire = parseInt(document.getElementById("fireScore").textContent);
    answers.earth = parseInt(document.getElementById("earthScore").textContent);
    answers.space = parseInt(document.getElementById("spaceScore").textContent);
    answers.water = parseInt(document.getElementById("waterScore").textContent);

    localStorage.setItem(
        "FiveElementsQuiz",
        JSON.stringify(answers)
    );

}

function updatePlanetScore() {

    let score = {
        Ketu: 0,
        Venus: 0,
        Sun: 0,
        Moon: 0,
        Mars: 0,
        Rahu: 0,
        Jupiter: 0,
        Saturn: 0,
        Mercury: 0
    };

    document.querySelectorAll('input[name^="p1_q"]:checked').forEach(radio => {
        score[radio.value]++;
    });

    document.getElementById("ketuScore").textContent = score.Ketu + " /13";
    document.getElementById("venusScore").textContent = score.Venus + " /13";
    document.getElementById("sunScore").textContent = score.Sun + " /13";
    document.getElementById("moonScore").textContent = score.Moon + " /13";
    document.getElementById("marsScore").textContent = score.Mars + " /13";
    document.getElementById("rahuScore").textContent = score.Rahu + " /13";
    document.getElementById("jupiterScore").textContent = score.Jupiter + " /13";
    document.getElementById("saturnScore").textContent = score.Saturn + " /13";
    document.getElementById("mercuryScore").textContent = score.Mercury + " /13";
}

// =====================================
// GUNA QUIZ SCORE
// =====================================

function updateGunaScore() {

    let score = {
        Sattav: 0,
        Rajas: 0,
        Tamas: 0
    };

    document.querySelectorAll('input[name^="gu_q"]:checked').forEach(radio => {
        score[radio.value]++;
    });

    document.getElementById("sattavScore").textContent = score.Sattav + " /25";
    document.getElementById("rajasScore").textContent = score.Rajas + " /25";
    document.getElementById("tamasScore").textContent = score.Tamas + " /25";
}

// =======================================
// ELEMENT BALANCE QUIZ
// =======================================

function updateElementBalanceScore() {

    let score = {
        Air: 0,
        Fire: 0,
        Water: 0
    };

    document.querySelectorAll('input[name^="eb_q"]:checked').forEach(radio => {

        score[radio.value]++;

    });

    document.getElementById("airElementScore").textContent =
        score.Air + " /30";

    document.getElementById("fireElementScore").textContent =
        score.Fire + " /30";

    document.getElementById("waterElementScore").textContent =
        score.Water + " /30";
}

let currentQuiz = 0;

const quizzes = document.querySelectorAll(".quiz-section");

function showQuiz(index) {

    quizzes.forEach(q => q.classList.remove("active"));

    quizzes[index].classList.add("active");

    document.getElementById("prevBtn").disabled =
        (index === 0);

    document.getElementById("nextBtn").disabled =
        (index === quizzes.length - 1);

}

function nextQuiz() {

    if (currentQuiz < quizzes.length - 1) {

        currentQuiz++;

        showQuiz(currentQuiz);

    }

}

function previousQuiz() {

    if (currentQuiz > 0) {

        currentQuiz--;

        showQuiz(currentQuiz);

    }

}

showQuiz(0);

// =====================================
// ADD MORE FILE UPLOAD
// =====================================

function addFileField(containerId, inputName, required = false) {

    const container = document.getElementById(containerId);

    if (!container) {
        alert("Container not found: " + containerId);
        return;
    }

    const br = document.createElement("br");

    const input = document.createElement("input");

    input.type = "file";
    input.name = inputName;

    input.accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.dwg,.dxf";

    if (required) {
        input.required = true;
    }

    container.appendChild(br);
    container.appendChild(input);
}

// ================= PRAKRITI TABLE SCORE =================

document.querySelectorAll('.prakriti-table input[type="radio"]').forEach(radio => {

    radio.addEventListener("change", updatePrakritiTableScore);

});

function updatePrakritiTableScore() {

    let air = 0;
    let fire = 0;
    let water = 0;

    document.querySelectorAll('.prakriti-table input[type="radio"]:checked').forEach(radio => {

        if (radio.value === "Air") air++;
        else if (radio.value === "Fire") fire++;
        else if (radio.value === "Water") water++;

    });

    document.getElementById("prakritiAirTotal").textContent = air;
    document.getElementById("prakritiFireTotal").textContent = fire;
    document.getElementById("prakritiWaterTotal").textContent = water;

}

updatePrakritiTableScore();