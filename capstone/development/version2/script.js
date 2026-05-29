(function () {

    "use strict";
    console.log('reading js');
    // console.log(webgazer);

    

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

    //for webgazer

    // const focusWarning = document.querySelector('#focusWarning');
    // let lookingAway = false;
    // let awayTimer;

    // const calibration = document.querySelector('#calibration');
    // const calDots = document.querySelectorAll('.calDot');

    // let calibrationClicks = 0;


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


                // animation of the greeting 

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

    // BEGIN BUTTON
    beginButton.addEventListener('click', function () {

        mainPage.classList.remove('showing');
        mainPage.classList.add('hidden');


        // initWebGazer();

        // calibration.classList.remove('hidden');
        // calibration.classList.add('showing');

        webgazer.params.facemeshDepsPath = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh';

webgazer.setGazeListener(function(data, elapsedTime) {
    if (data == null) {
        return;
    }
   
    // Gaze coordinates relative to the viewport
    var xprediction = data.x;
    var yprediction = data.y;
   
    console.log("Gaze at: " + xprediction + ", " + yprediction);
}).begin();

// Optional: Hide the video feed and prediction dot
webgazer.showVideoPreview(true)
        .showPredictionPoints(true);
        


        // setTimeout(function () {
        //     startNatureBreak();
        // }, 20000);

    });

    // NATURE BREAK
    // function startNatureBreak() {

    //     timerBar.style.animation = 'none';
    //     timerBar.offsetHeight;
    //     timerBar.style.animation = 'countdown 10s linear forwards';

    //     outdoorsBreak.classList.remove('hidden');

    //     setTimeout(function () {
    //         outdoorsBreak.classList.add('showing');
    //     }, 10);

    //     setTimeout(function () {

    //         outdoorsBreak.classList.remove('showing');

    //         setTimeout(function () {
    //             outdoorsBreak.classList.add('hidden');
    //         }, 500);

    //     }, 10000);
    // }

    // CALIBRATION - help from video tutorial + AI + WebGazer site; still confused

    // calDots.forEach(function (dot) {

    //     dot.addEventListener('click', function (e) {

    //         console.log('dot clicked'); 

    //         const rect = dot.getBoundingClientRect();

    //         webgazer.recordScreenPosition(
    //             rect.left + rect.width / 2,
    //             rect.top + rect.height / 2,
    //             'click'
    //         );

    //         dot.style.background = 'green';

    //         calibrationClicks++;

    //         if (calibrationClicks >= calDots.length) {

    //             calibration.classList.remove('showing');
    //             calibration.classList.add('hidden');

    //             task.classList.remove('hidden');
    //             task.classList.add('showing');

    //             startWebGazerBase();
    //         }
    //     });

    // });

    // WEB GAZER BASE
    // function startWebGazerBase() {

    //     console.log("starting webgaxer");

    //     webgazer.showVideo(true);
    //     webgazer.showFaceOverlay(true);
    //     webgazer.showFaceFeedbackBox(true);

    //     webgazer.setRegression('ridge');

    //     webgazer.begin();
    // }

    // // START WEB GAZER FUNCTION
    // function startWebGazer() {

    //     webgazer.setRegression('ridge');

    //     webgazer.setGazeListener(function (data) {

    //         if (!data) return;

    //         console.log("WORKING:", data.x, data.y);

    //         const x = data.x;
    //         const y = data.y;

    //         const article = document.querySelector('#task article');
    //         const rect = article.getBoundingClientRect();

    //         const padding = 50;

    //         const insideArticle =
    //             x > rect.left - padding &&
    //             x < rect.right + padding &&
    //             y > rect.top - padding &&
    //             y < rect.bottom + padding;

    //         if (!insideArticle) {
    //             focusWarning.classList.remove('hidden');
    //             focusWarning.classList.add('showing');
    //             // console.log('looking at article'); 
    //         } else {
    //             focusWarning.classList.remove('showing');
    //             focusWarning.classList.add('hidden');
    //             // console.log('not looking at article'); 
    //         }

    //     });

    //     webgazer.begin();

    //     webgazer.showVideo(true);
    //     webgazer.showFaceOverlay(true);
    //     webgazer.showFaceFeedbackBox(true);

    //     console.log("WEBGAZER STARTED");
    // }

    // WEB GAZER NEW


    // COMPREHENTION
    const article = document.querySelector('#task article');
    const comprehension = document.querySelector('#comprehension');

    article.addEventListener('scroll', function () {

        const atBottom =
            article.scrollTop + article.clientHeight >= article.scrollHeight - 10;

        if (atBottom) {
            comprehension.classList.remove('hidden');
        }
    });

})();