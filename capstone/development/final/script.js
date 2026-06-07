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

    // webgazer elements
    const focusWarning = document.querySelector('#focusWarning');
    const calibration = document.querySelector('#calibration');
    const calDots = document.querySelectorAll('.calDot');

    let calibrationClicks = 0;

    // ---- helpers to hide/show WebGazer's video overlay ----
    // WebGazer injects #webgazerVideoContainer when .begin() runs.
    // We keep it hidden via CSS until calibration is complete.
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
    enterButton.addEventListener('click', function () {

        const userName = document.querySelector('#name').value;
        greeting.textContent = `Good Morning ${userName}!`;

        signIn.classList.remove('showing');
        signIn.classList.add('hidden');
        loading.classList.remove('hidden');
        loading.classList.add('showing');

        setTimeout(function () {

            loading.classList.add('fadeOut');

            setTimeout(function () {

                loading.classList.remove('showing');
                loading.classList.add('hidden');
                loading.classList.remove('fadeOut');

                mainPage.classList.remove('hidden');
                mainPage.classList.add('showing');
                mainPage.classList.add('fadeIn');

                sideBar.classList.remove('hidden');
                sideBar.classList.add('showing');
                sideBar.classList.add('fadeIn');

                setTimeout(function () {
                    greeting.classList.add('animateText');
                }, 300);

                setTimeout(function () {
                    mainParagraph.classList.add('animateText');
                }, 900);

                setTimeout(function () {
                    taskList.classList.add('animateText');
                }, 1500);

            }, 1000);

        }, 2000);

    });

    // BEGIN BUTTON - start WebGazer BEFORE calibration so dot clicks train the model
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
                if (!data) return;

                const lookingAtScreen =
                    data.x > 0 && data.y > 0 &&
                    data.x < window.innerWidth &&
                    data.y < window.innerHeight;

                focusWarning.classList.toggle('showing', !lookingAtScreen);
            })
            .begin();

        // Hide everything during calibration. We hide the whole container at the
        // CSS level so WebGazer's default preview can't flash on screen.
        webgazer.showVideoPreview(false);
        webgazer.showPredictionPoints(false);
        hideGazeOverlay();

        // Wait until the camera is actually delivering frames before relying on it.
        const video = document.getElementById('webgazerVideoFeed');
        if (video) {
            await new Promise(resolve => {
                if (video.videoWidth > 0) return resolve();
                video.addEventListener('loadeddata', resolve, { once: true });
            });
            console.log('video ready:', video.videoWidth, video.videoHeight);
        }

        // Re-hide in case WebGazer re-showed the container after frames arrived.
        hideGazeOverlay();
    }

    // CALIBRATION - each click trains the model at that screen position
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

                // Now reveal the video preview + gaze dot on the task page.
                showGazeOverlay();
            }

        });

    });

    // TASK HIGHLIGHT
    const adjectives = document.querySelectorAll('.adj');

    adjectives.forEach(function (word) {
        word.addEventListener('click', function () {
            word.classList.toggle('highlight');
        });
    });

    // END BUTTON
    endButton.addEventListener('click', function () {

        task.classList.remove('showing');
        task.classList.add('hidden');

        comprehension.classList.remove('hidden');
        comprehension.classList.add('showing');

        currentQuestion = 0;
        showQuestion();

        webgazer.end();
        hideGazeOverlay();

        sideBar.classList.remove('showing');
        sideBar.classList.add('hidden');
    });

    // COMPREHENSION
    const article = document.querySelector('#task article');

    const questions = [
        "I would be stressed out in this type of learning environment",
        "Being watched by a browser while completing work impedes my learning.",
        "Notifications on my phone and computer stop me from doing work.",
        "I am scared for the future of education.",
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
            questionText.textContent = "Survey complete. Thank you!";

            document.querySelector('.likertScale').style.display = 'none';
            document.querySelector('.scaleLabels').style.display = 'none';

            console.log(answers);
        }
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

})();