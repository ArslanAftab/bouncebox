let balls = [];
let bounceSound;
let gravitySlider;
let resetButton;

function setup() {
    createCanvas(800, 600);
    frameRate(60);

    gravitySlider = createSlider(0, 0.5, 0.3, 0.01);
    gravitySlider.position(10, 10);
    gravitySlider.style('width', '80px');
    let gravityLabel = createP('Gravity');
    gravityLabel.position(10, 10);

    resetButton = createButton('Reset');
    resetButton.position(10, 60);
    resetButton.mousePressed(resetSketch);

}

function resetSketch() {
    balls = []; // Clear the balls array
}

function preload() {
    bounceSound = loadSound('sound.mp3');
}

function checkCollisions() {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            let dx = balls[j].x - balls[i].x;
            let dy = balls[j].y - balls[i].y;
            let distance = sqrt(dx * dx + dy * dy);
            let minDist = balls[i].radius + balls[j].radius;

            if (distance < minDist) {
                let overlap = 0.5 * (minDist - distance);

                let nx = dx / distance;
                let ny = dy / distance;

                balls[i].x -= overlap * nx;
                balls[i].y -= overlap * ny;
                balls[j].x += overlap * nx;
                balls[j].y += overlap * ny;

                // Exchange speeds
                [balls[i].xSpeed, balls[j].xSpeed] = [balls[j].xSpeed, balls[i].xSpeed];
                [balls[i].ySpeed, balls[j].ySpeed] = [balls[j].ySpeed, balls[i].ySpeed];
            }
        }
    }
}

function draw() {
    background(220);

    // Display FPS in the top right corner
    let fps = frameRate();
    fill(0);
    stroke(0);
    textAlign(RIGHT);
    text("FPS: " + fps.toFixed(2), width - 10, 20);

    // Display ball count
    textAlign(LEFT);
    text("Balls: " + balls.length, 10, 20);
    
    for (let i = 0; i < balls.length; i++) {
        let ball = balls[i];
        ball.applyGravity();
        ball.move();
        ball.display();
    }
    checkCollisions();
}

function mousePressed() {
    // Add a ball only when the mouse is within the canvas
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        if (balls.length < 10) {
            let newBall = new Ball(mouseX, mouseY);
            balls.push(newBall);
        }
    }
}


class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.xSpeed = random(-2, 2);
        this.ySpeed = 0;
        this.damping = 0.90;
        this.gravity = 0.1;
        this.color = color(random(255), random(255), random(255)); 
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
            this.y = height - this.radius;
            this.ySpeed *= -this.damping;
            if (abs(this.ySpeed) > 1) {
                bounceSound.play();
            }
        }

        // Bounce off the top edge
        if (this.y < this.radius) {
            this.y = this.radius;
            this.ySpeed *= -this.damping;
        }
    }

    display() {
        fill(this.color); // Use the random color
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    }
}
