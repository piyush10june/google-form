// ========================================
// BLUEBERRY ASTROVASTU
// FIVE ELEMENTS QUIZ
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ============================
    // Only ONE option per question
    // ============================

    const radios = document.querySelectorAll('tbody input[type="radio"]');

    radios.forEach(radio => {

        radio.addEventListener("change", function () {

            updateScore();

        });

    });

    updateScore();

});

// ========================================
// Update Score
// ========================================

function updateScore() {

    let air = 0;
    let fire = 0;
    let earth = 0;
    let space = 0;
    let water = 0;

    document.querySelectorAll(
        'tbody input[type="radio"]:checked'
    ).forEach(radio => {

        switch (radio.value) {

            case "Air":
                air++;
                break;

            case "Fire":
                fire++;
                break;

            case "Earth":
                earth++;
                break;

            case "Space":
                space++;
                break;

            case "Water":
                water++;
                break;

        }

    });

    document.getElementById("airScore").textContent = air + " /25";
    document.getElementById("fireScore").textContent = fire + " /25";
    document.getElementById("earthScore").textContent = earth + " /25";
    document.getElementById("spaceScore").textContent = space + " /25";
    document.getElementById("waterScore").textContent = water + " /25";

}

// ========================================
// NEXT BUTTON
// ========================================

function nextPage() {

    // Validate every question
    for (let i = 1; i <= 25; i++) {

        const selected = document.querySelector(
            'input[name="q' + i + '"]:checked'
        );

        if (!selected) {

            alert("Please answer Question " + i);

            return;

        }

    }

    // Save answers

    const answers = {};

    for (let i = 1; i <= 25; i++) {

        const selected = document.querySelector(
            'input[name="q' + i + '"]:checked'
        );

        answers["q" + i] = selected.value;

    }

    // Save Scores

    answers.airScore =
        parseInt(document.getElementById("airScore").textContent);

    answers.fireScore =
        parseInt(document.getElementById("fireScore").textContent);

    answers.earthScore =
        parseInt(document.getElementById("earthScore").textContent);

    answers.spaceScore =
        parseInt(document.getElementById("spaceScore").textContent);

    answers.waterScore =
        parseInt(document.getElementById("waterScore").textContent);

    localStorage.setItem(
        "FiveElementsQuiz",
        JSON.stringify(answers)
    );

    // Go to next page

    window.location.href = "page2.html";

}

// ========================================
// SHOW / HIDE ACCESSORY DESCRIPTION
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".accessory-check").forEach(function (checkbox) {

        checkbox.addEventListener("change", function () {

            const description = document.getElementById(
                this.id.replace("Check", "Description")
            );

            if (!description) return;

            if (this.checked) {

                description.style.display = "block";
                description.required = true;

            } else {

                description.style.display = "none";
                description.required = false;
                description.value = "";

            }

        });

    });

});

function addField(containerId, name, placeholder) {

    const container = document.getElementById(containerId);

    const input = document.createElement("input");

    input.type = "text";

    input.name = name;

    input.placeholder = placeholder;

    input.style.marginTop = "10px";

    container.appendChild(input);

}

function addTextarea(containerId, name, placeholder) {

    const container = document.getElementById(containerId);

    const textarea = document.createElement("textarea");

    textarea.name = name;

    textarea.placeholder = placeholder;

    textarea.style.marginTop = "10px";

    container.appendChild(textarea);

}

