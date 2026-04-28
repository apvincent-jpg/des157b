(function () {
    'use strict';

    async function fetchdata() {
        const response = await fetch('./data.json');
        const data = await response.json();

        const triangles = document.querySelectorAll('.tri img');
        const circles = document.querySelectorAll('.circles img');

        const scaleFactor = 0.335;

        function hideAllCircles() {
            for (var i = 0; i < circles.length; i++) {
                circles[i].style.visibility = 'hidden';
            }
        }

        for (var i = 0; i < triangles.length; i++) {

            const triangle = triangles[i];
            const miles = data[i].miles;
            const circle = circles[i];

            const scaleValue = 1 + (miles * scaleFactor);

         
            triangle.addEventListener('mouseenter', function (scale) {
                return function () {
                    this.style.transform = `scale(${scale})`;
                };
            }(scaleValue));

          
            triangle.addEventListener('click', function () {
                hideAllCircles();
                circle.style.visibility = 'visible';
            });
        }
    }

    fetchdata();

})();