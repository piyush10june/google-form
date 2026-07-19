// =====================================
// BLUEBERRY ASTROVASTU
// PAGE 2 - FIVE ELEMENTS QUIZ
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    const radios = document.querySelectorAll('input[type="radio"]');

    radios.forEach(radio => {
        radio.addEventListener("change", updateScore);
    });

    updateScore();

});

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

}

// =====================================
// PREVIOUS PAGE
// =====================================

function previousPage() {

    window.location.href = "index.html";

}

// =====================================
// NEXT PAGE
// =====================================

function nextPage() {

    // Validate all questions answered

    for (let i = 1; i <= 25; i++) {

        if (!document.querySelector('input[name="q' + i + '"]:checked')) {

            alert("Please answer Question " + i);

            return;
        }

    }

    // Save answers

    const answers = {};

    for (let i = 1; i <= 25; i++) {

        answers["q" + i] =
            document.querySelector('input[name="q' + i + '"]:checked').value;

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

    window.location.href = "page3.html";

}