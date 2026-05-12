//library 

let imgs = [];

function preload() {
  // Load the image files.
  imgs[0] = loadImage('images/lib_beetle.png');
  imgs[1] = loadImage('images/lib_person.png');
  imgs[2] = loadImage('images/lib_star.png');
  imgs[3] = loadImage('images/lib_mountain.png');

}

function setup() {
  createCanvas(1200, 750, WEBGL);
  angleMode(DEGREES);
  imageMode(CENTER);
}

function draw() {
  background(0, 93, 152);
  orbitControl();

  for (let zAngle = 0; zAngle < 180; zAngle += 30) {

    let layerIndex = zAngle / 30;
    let currentImg = imgs[layerIndex % imgs.length];

    for (let xAngle = 0; xAngle < 360; xAngle += 10) {
      push();

      rotateZ(zAngle);
      rotateX(xAngle);

      translate(0, 400, 0);

      rotateX(-xAngle);
      rotateZ(-zAngle);

      image(currentImg, 0, 0, 50, 50);

      pop();
    }
  }
}