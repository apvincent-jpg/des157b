(function () {

    console.log('reading js');
    "use strict";

    const fs = document.querySelector('.fa-expand-alt');
    const video1 = document.querySelector('#video1');
    const section = document.querySelector("section");
    // const type = document.querySelector("p"); // not needed
    const intervalID = setInterval(checkTime, 10000);

    const line1 = document.querySelector('.line1');
    const line2 = document.querySelector('.line2');
    const line3 = document.querySelector('.line3');
    const line4 = document.querySelector('.line4');

    const lines = document.querySelectorAll("section div");
    const img = document.querySelector('img');
    let canChange = true;

    // hide all lines at start
    lines.forEach(function (line) {
        line.className = "hidden";
    });

    fs.addEventListener('click', function () {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    //random type function
    function randomType(container) {

        if (!canChange) return;
        const lines = container.querySelectorAll("p");

        lines.forEach(function (line) {
            line.style.position = "absolute";
            line.style.top = Math.random() * 80 + "vh";
            line.style.left = Math.random() * 80 + "vw";
            // line.style.color = "white";
            line.style.zIndex = "10";
        });
    }
    //check time
    function checkTime() {

        lines.forEach(function (line) {
            line.classList.remove("showing");
            line.classList.add("hidden");
        });

        img.classList.remove("showing");
        img.classList.add("hidden");

        const t = video1.currentTime;

        if (t > 2.5 && t < 7) {
            img.classList.remove("hidden");
            img.classList.add("showing");
        }

        else if (t >= 8 && t < 12) {
            line1.classList.remove("hidden");
            line1.classList.add("showing");
            randomType(line1);
        }

        else if (t >= 12 && t < 18) {
            line2.classList.remove("hidden");
            line2.classList.add("showing");
            randomType(line2);
        }

        else if (t >= 18 && t < 22) {
            line3.classList.remove("hidden");
            line3.classList.add("showing");
            randomType(line3);
        }

        else if (t >= 22 && t < 28) {
            line4.classList.remove("hidden");
            line4.classList.add("showing");
            randomType(line4);
        }
    }

    video1.addEventListener("timeupdate", checkTime);


    //grayscale switch 
    document.addEventListener("click", function () {
    video1.classList.toggle("grayscaleSwitch");
});
    

})();