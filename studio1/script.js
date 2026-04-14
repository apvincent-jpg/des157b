



      (function (){

        const fs = document.querySelector('.fa-expand-alt');

        console.log('reading js'); 

        fs.addEventListener('click', function(){
            if(!document.fullscreenElement) {
                document.documentElement.requestFullscreen(); 
            } else{
                document.exitFullscreen(); 
            }
        }); 

       }) (); 

       const video1 = document.querySelector('#video1'); 
       const section = document.querySelector("section"); 
       const type = document.querySelector("p");
       const img1 = document.querySelector("img"); 

       const intervalID = setInterval(checkTime,1000); 

       type.className = "hidden";
       img1.className = "hidden";


       function checkTime() {
            if (1 < video1.currentTime && video1.currentTime < 3) {
                type.className = "showing"; 
            } else {
                type.className = "hidden"; 
            }
            if (5 < video1.currentTime && video1.currentTime < 7) {
                img1.className = "showing"; 
            } else {
                img1.className = "hidden"; 
            }
       }

