let balls = [];
let bounceSound;
let gravitySlider;

function setup() {
    createCanvas(800, 600);
    frameRate(60);
    
    gravitySlider = createSlider(0, 0.5, 0.1, 0.01); // Min, Max, Default, Step
    gravitySlider.position(10, 10);
    gravitySlider.style('width', '80px');
    
    let gravityLabel = createP('Gravity'); // Create label element
    gravityLabel.position(10, 10);
}

function preload() {
    bounceSound = loadSound('sound.mp3'); // Replace with your sound file path
}

function draw() {
    background(220);

    // Display FPS in the top right corner
    let fps = frameRate();
    fill(0);
    stroke(0);
    textAlign(RIGHT);
    text("FPS: " + fps.toFixed(2), width - 10, 20);

    for (let i = 0; i < balls.length; i++) {
        let ball = balls[i];
        ball.applyGravity();
        ball.move();
        ball.display();
    }
}

function mousePressed() {
    let newBall = new Ball(mouseX, mouseY);
    balls.push(newBall);
}

class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.xSpeed = random(-2, 2);
        this.ySpeed = 0; // Starts with no vertical speed
        this.damping = 0.90; // Energy loss factor
        this.gravity = 0.1; // Gravity factor
    }

    applyGravity() {
        this.ySpeed += gravitySlider.value();
    }

    move() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // Bounce off left and right edges
        if (this.x > width - this.radius || this.x < this.radius) {
            this.xSpeed *= -1;
        }

        // Bounce off the bottom edge
        if (this.y > height - this.radius) {
            this.y = height - this.radius; // Reset to the bottom edge
            this.ySpeed *= -this.damping; // Reverse speed with damping
            if (abs(this.ySpeed) > 1) { // Check to ensure sound is not played on tiny bounces
                bounceSound.play();
            }
        }
    }

    display() {
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    }
}
