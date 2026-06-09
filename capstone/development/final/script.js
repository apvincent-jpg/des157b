(function () {

    "use strict";
    console.log('reading js');

    const signIn = document.querySelector('#signIn');
    const loading = document.querySelector('#loading');
    const mainPage = document.querySelector('#mainPage');
    const sideBar = document.querySelector('#sideBar');

    const enterButton = document.querySelector('#enterButton');
    const nameInput = document.querySelector('#name');

    const greeting = document.querySelector('#mainPage h1');
    const mainParagraph = document.querySelector('#mainPage p');
    const taskList = document.querySelector('#mainPage ul');

    const beginButton = document.querySelector('#beginButton');
    const task = document.querySelector('#task');
    const outdoorsBreak = document.querySelector('#outdoorsBreak');
    const timerBar = document.querySelector('#timerBar');

    const endButton = document.querySelector('#endButton');
    const comprehension = document.querySelector('#comprehension');

    const rubricButton = document.querySelector("#rubricButton");
    const rubricOverlay = document.querySelector("#rubricOverlay");
    const tutorialOverlay = document.querySelector("#tutorialOverlay");
    const closeRubric = document.querySelector("#closeRubric");

    const resultsPopup = document.querySelector("#resultsPopup");
    const gradeResult = document.querySelector("#gradeResult");
    const comparisonResult = document.querySelector("#comparisonResult");
    const continueButton = document.querySelector("#continueButton");
    const container = document.querySelector("#simpleChart");

    const performanceReport = document.querySelector("#performanceReport");
    const homeButton = document.querySelector('#homeButton');

    let lastPenaltyTime = 0;
    let offScreenStart = null;
    let natureBreakShown = false;
    let grade = 0;

    const TASK_TIME = 100;
    let timeLeft = TASK_TIME;
    let timerInterval = null;

    let questionStartTime = Date.now();

    // webgazer elements
    const focusWarning = document.querySelector('#focusWarning');
    const calibration = document.querySelector('#calibration');
    const calDots = document.querySelectorAll('.calDot');

    let calibrationClicks = 0;

    // ---- helpers to hide/show WebGazer's video overlay ---- mahima
    function hideGazeOverlay() {
        const container = document.getElementById('webgazerVideoContainer');
        if (container) container.style.display = 'none';
    }

    function showGazeOverlay() {
        const container = document.getElementById('webgazerVideoContainer');
        if (container) container.style.display = 'block';
        webgazer.showVideoPreview(true);
        webgazer.showPredictionPoints(true);
    }

    // ENTER BUTTON
    enterButton.addEventListener('click', function (e) {

        e.preventDefault();
        console.log("ENTER CLICKED");

        const userName = nameInput.value;
        const greeting = document.querySelector('#mainPage h1');

        if (greeting) {
            greeting.textContent = `Good Morning ${userName}!`;
        }

        signIn.classList.remove('showing');
        signIn.classList.add('hidden');

        loading.classList.remove('hidden');
        loading.classList.add('showing');

        setTimeout(function () {

            loading.classList.add('fadeOut');

            setTimeout(function () {

                loading.classList.add('hidden');
                loading.classList.remove('showing');

                mainPage.classList.remove('hidden');
                mainPage.classList.add('showing');

                sideBar.classList.remove('hidden');
                sideBar.style.display = "flex";

                void mainPage.offsetWidth;

                setTimeout(function () {
                    greeting.classList.add('animateText');
                }, 200);

                setTimeout(function () {
                    mainParagraph.classList.add('animateText');
                }, 600);

                setTimeout(function () {
                    taskList.classList.add('animateText');
                }, 1000);

            }, 1000);

        }, 2000);
    });

    // SIDE BAR CONTENT
    rubricButton.addEventListener("click", function () {
        rubricOverlay.classList.remove("hidden");
        rubricOverlay.classList.add("showing");
        rubricButton.classList.remove('rubricGlow', 'pulse');
    });

    closeRubric.addEventListener('click', function () {
        rubricOverlay.classList.add("hidden");
        rubricOverlay.classList.remove("showing");
        tutorialOverlay.classList.add("hidden");
        tutorialOverlay.classList.remove("showing");
        rubricButton.classList.remove("pulse");
    });

    rubricOverlay.addEventListener("click", function (e) {
        if (e.target === rubricOverlay) {
            rubricOverlay.classList.add("hidden");
            rubricOverlay.classList.remove("showing");
        }
    });

    // BEGIN BUTTON
    beginButton.addEventListener('click', async function () {
        console.log('begin clicked');

        mainPage.classList.remove('showing');
        mainPage.classList.add('hidden');

        calibration.classList.remove('hidden');
        calibration.classList.add('showing');

        webgazer.params.facemeshDepsPath = './mediapipe/face_mesh';

        await startWebGazer();
        console.log('WebGazer started');
    });

    // START WEBGAZER
    async function startWebGazer() {
        console.log('startWebGazer started');

        await webgazer.setRegression('ridge')
            .setGazeListener(function (data) {

                if (!data || data.x == null || data.y == null) return;

                const lookingAtScreen =
                    data.x >= 0 &&
                    data.y >= 0 &&
                    data.x <= window.innerWidth &&
                    data.y <= window.innerHeight;

                focusWarning.classList.toggle('showing', !lookingAtScreen);

                if (!lookingAtScreen) {

                    if (!offScreenStart) {
                        offScreenStart = Date.now();
                    }

                    if (Date.now() - lastPenaltyTime > 2000) {
                        grade -= 1;
                        updateGradeDisplay();
                        lastPenaltyTime = Date.now();
                        const scoreBoard = document.querySelector("#scoreBoard");

                        if (scoreBoard) {
                            scoreBoard.textContent = `Score: ${grade}`;
                        }
                    }

                } else {
                    offScreenStart = null;
                }

            })
            .begin();

        webgazer.showVideoPreview(false);
        webgazer.showPredictionPoints(false);
        hideGazeOverlay();

        const video = document.getElementById('webgazerVideoFeed');
        if (video) {
            await new Promise(function (resolve) {
                if (video.videoWidth > 0) return resolve();
                video.addEventListener('loadeddata', resolve, { once: true });
            });
            console.log('video ready:', video.videoWidth, video.videoHeight);
        }

        hideGazeOverlay();
    }

    // CALIBRATION
    calDots.forEach(function (dot) {

        dot.addEventListener('click', function () {

            if (dot.style.background === 'green') return;

            console.log('dot clicked');

            const rect = dot.getBoundingClientRect();

            webgazer.recordScreenPosition(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                'click'
            );

            dot.style.background = 'green';
            calibrationClicks++;

            if (calibrationClicks >= calDots.length) {
                console.log('All dots calibrated. Activating task interface...');

                calibration.classList.remove('showing');
                calibration.classList.add('hidden');

                task.classList.remove('hidden');
                task.classList.add('showing');

                startTaskTimer();
                showGazeOverlay();
            }

        });

    });

    // GRADE
    function updateGradeDisplay() {
        const percent = Math.max(0, Math.min(100, grade));
        document.querySelector("#gradeDisplay").textContent = `${percent}%`;
    }

    // TIMER 
    function startTaskTimer() {

        timerInterval = setInterval(function () {

            if (typeof isTaskCompleted !== 'undefined' && isTaskCompleted) {
                clearInterval(timerInterval);
                return;
            }

            timeLeft--;

            const percent = (Number(timeLeft) / Number(TASK_TIME)) * 100;
            timerBar.style.width = percent + "%";

            if (!natureBreakShown && timeLeft <= Math.floor(TASK_TIME * 0.5)) {
                natureBreakShown = true;

                outdoorsBreak.classList.remove('hidden');
                outdoorsBreak.classList.add('showing');

                setTimeout(function () {
                    outdoorsBreak.classList.remove('showing');
                    outdoorsBreak.classList.add('hidden');
                }, 5000);
            }

            if (timeLeft === Math.floor(TASK_TIME * 0.75)) {
                notify("You should be 1/4 done");
            }

            if (timeLeft === Math.floor(TASK_TIME * 0.5)) {
                notify("You should be halfway done");
            }

            if (timeLeft === Math.floor(TASK_TIME * 0.25)) {
                notify("You should be 3/4 done");
            }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                notify("Time is up!");
            }

        }, 1000);
    }

    function notify(msg) {
        const box = document.querySelector("#progressNotice");
        box.textContent = msg;
        box.style.display = "block";

        setTimeout(function () {
            box.style.display = "none";
        }, 3000);
    }

    // TASK HIGHLIGHT
    const adjectives = document.querySelectorAll('.adj');

    adjectives.forEach(function (word) {
        word.addEventListener('click', function () {

            const timeTaken = (Date.now() - questionStartTime) / 1000;

            word.classList.toggle('highlight');
            grade += 10;
            updateGradeDisplay();

            if (timeTaken > 5) {
                grade -= 2;
                updateGradeDisplay();
            }

            console.log("Score:", grade);

        });
    });

    // END BUTTON
    endButton.addEventListener('click', function () {

        task.classList.remove('showing');
        task.classList.add('hidden');

        const classAverage = 75;
        const difference = grade - classAverage;

        gradeResult.textContent = `Your current grade is ${grade}%`;

        if (difference >= 0) {
            comparisonResult.textContent = `You are ${difference}% ABOVE the classroom average.`;
        } else {
            comparisonResult.textContent = `You are ${Math.abs(difference)}% BELOW the classroom average.`;
        }

        resultsPopup.classList.add("showing");

        webgazer.end();
        hideGazeOverlay();

        sideBar.classList.remove('showing');
        sideBar.classList.add('hidden');
    });

    // CONTINUE
    continueButton.addEventListener("click", function () {
        resultsPopup.classList.remove("showing");

        sideBar.style.display = "none";

        comprehension.classList.remove("hidden");
        comprehension.classList.add("showing");

        currentQuestion = 0;
        showQuestion();
    });

    // RUBRIC
    rubricButton.addEventListener("click", function () {
        rubricOverlay.classList.remove("hidden");
        rubricOverlay.classList.add("showing");
        rubricButton.classList.remove("rubricGlow", "pulse");
    });

    closeRubric.addEventListener("click", function () {
        rubricOverlay.classList.add("hidden");
        rubricOverlay.classList.remove("showing");
    });

    rubricOverlay.addEventListener("click", function (e) {
        if (e.target === rubricOverlay) {
            rubricOverlay.classList.add("hidden");
            rubricOverlay.classList.remove("showing");
        }
    });

    // COMPREHENSION
    const article = document.querySelector('#task article');

    const questions = [
        "I would be stressed out in this type of learning environment.",
        "Being watched by a browser while completing work impedes my learning.",
        "Notifications on my phone and computer are easily avoidable when doing homework.",
        "Seeing my grade automatically change with each question answered helps me do better.",
        "Grades accurately represent how much a student has learned."
    ];

    let currentQuestion = 0;
    const answers = [];

    const questionText = document.querySelector('#questionText');
    const scaleButtons = document.querySelectorAll('.scaleBtn');

    function showQuestion() {
        if (currentQuestion < questions.length) {
            questionText.textContent = questions[currentQuestion];
        } else {
            console.log("SHOWING SEPARATE CHART SECTION");

            comprehension.classList.remove("showing");
            comprehension.classList.add("hidden");

            const resultsSection = document.querySelector("#resultsSection");
            resultsSection.classList.remove("hidden");
            resultsSection.classList.add("showing");

            showResultsChart();
        }
    }

    function showResultsChart() {
        const container = document.querySelector("#simpleChart");
        const data = generateFakeComparison(answers);

        container.innerHTML = "";

        const customGradients = [
            "linear-gradient(to right, #add8e6 10%, #4169e1 40%, #00008b 75%)",
            "linear-gradient(to right, #add8e6 20%, #4169e1 60%, #00008b 90%)",
            "linear-gradient(to right, #add8e6 45%, #4169e1 80%, #00008b 95%)",
            "linear-gradient(to right, #add8e6 10%, #4169e1 50%, #00008b 90%)",
            "linear-gradient(to right, #add8e6 35%, #4169e1 70%, #00008b 95%)"
        ];

        data.forEach(function (item, index) {
            const row = document.createElement("div");
            row.classList.add("chartRow");

            const label = document.createElement("div");
            label.classList.add("label");
            label.textContent = item.question;

            const barContainer = document.createElement("div");
            barContainer.classList.add("barContainer");

            barContainer.style.background = customGradients[index] || "linear-gradient(to right, #add8e6, #00008b)";

            const userMarker = document.createElement("div");
            userMarker.classList.add("marker", "userMarker");
            userMarker.style.left = (item.user * 20) + "%";

            barContainer.appendChild(userMarker);
            row.appendChild(label);
            row.appendChild(barContainer);

            container.appendChild(row);
        });
    }

    scaleButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            answers.push({
                question: questions[currentQuestion],
                answer: button.dataset.value
            });

            currentQuestion++;
            showQuestion();
        });
    });

    // RESULTS CHART
    function generateFakeComparison(userAnswers) {
        return userAnswers.map(function (a) {
            return {
                question: a.question,
                user: Number(a.answer),
                average: Math.floor(Math.random() * 2) + 3
            };
        });
    }

    // PERFORMANCE REPORT
    function showPerformanceReport() {
        const average = 72;
        const difference = grade - average;
        let comparison;

        if (difference > 0) {
            comparison = `${difference}% above classroom average`;
        } else {
            comparison = `${Math.abs(difference)}% below classroom average`;
        }

        document.querySelector("#reportText").innerHTML =
        `Final Grade: <strong>${grade}%</strong><br><br>
        Your performance ranks ${comparison}.<br><br>
        This result will be used to optimize future learning pathways.`;

        document.querySelector("#performanceReport").classList.remove("hidden");
    }

    // HOME BUTTON

    if (homeButton) {
    homeButton.addEventListener('click', function () {
        console.log("Home button clicked - returning to main page");

        // Stop the timer if it's currently running so it doesn't background-tick
        if (timerInterval) {
            clearInterval(timerInterval);
        }

        // List all your potential page elements that might be open
        const screens = [signIn, loading, task, comprehension, resultsPopup, calibration];

        // Hide every screen to reset the view safely
        screens.forEach(function (screen) {
            if (screen) {
                screen.classList.remove('showing');
                screen.classList.add('hidden');
            }
        });

        // Bring the main page and sidebar back to life
        if (mainPage) {
            mainPage.classList.remove('hidden');
            mainPage.classList.add('showing');
        }
        
        if (sideBar) {
            sideBar.style.display = "flex";
        }
        
        // Reset necessary task variables so they can try again fresh
        timeLeft = TASK_TIME;
        natureBreakShown = false;
    });
}

})();