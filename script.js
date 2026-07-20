// ========================================
// BLUEBERRY ASTROVASTU
// FIVE ELEMENTS QUIZ
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ============================
    // Only ONE option per question
    // ============================

    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');

    checkboxes.forEach(box => {

        box.addEventListener("change", function () {

            if (this.checked) {

                document.querySelectorAll(
                    'input[name="' + this.name + '"]'
                ).forEach(other => {

                    if (other !== this) {
                        other.checked = false;
                    }

                });

            }

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
        'tbody input[type="checkbox"]:checked'
    ).forEach(box => {

        switch (box.value) {

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

    window.location.href = "page3.html";

}

//---------------------------------------------------------------------
document.getElementById("testEmailBtn").addEventListener("click", async () => {

    try {

        const response = await fetch("/api/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (result.success) {
            alert("✅ Email Sent Successfully!");
        } else {
            alert("❌ " + result.error);
        }

    } catch (err) {
        console.error(err);
        alert("Something went wrong.");
    }

});