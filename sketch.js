let balls = [];
let bounceSound;
let gravitySlider;
let resetButton;
let obstacles = [];

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

    // Add a few initial obstacles
    obstacles.push(new Obstacle(100, 200, 100, 20));
    obstacles.push(new Obstacle(300, 400, 150, 20));
    // More obstacles can be added as needed
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

                [balls[i].xSpeed, balls[j].xSpeed] = [balls[j].xSpeed, balls[i].xSpeed];
                [balls[i].ySpeed, balls[j].ySpeed] = [balls[j].ySpeed, balls[i].ySpeed];
            }
        }
    }
}

function draw() {
    background(220);

    let fps = frameRate();
    fill(0);
    stroke(0);
    textAlign(RIGHT);
    text("FPS: " + fps.toFixed(2), width - 10, 20);

    textAlign(LEFT);
    text("Balls: " + balls.length, 10, 20);
    
    for (let i = 0; i < balls.length; i++) {
        balls[i].applyGravity();
        balls[i].move();
        balls[i].display();
    }

    for (let obstacle of obstacles) {
        obstacle.display();
    }

    checkCollisions();
}

function mousePressed() {
    if (mouseButton === LEFT && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
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
        this.color = color(random(255), random(255), random(255)); 
    }

    applyGravity() {
        this.ySpeed += gravitySlider.value();
    }

    move() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x > width - this.radius || this.x < this.radius) {
            this.xSpeed *= -1;
        }

        if (this.y > height - this.radius) {
            this.y = height - this.radius;
            this.ySpeed *= -this.damping;
            if (abs(this.ySpeed) > 1) {
                bounceSound.play();
            }
        }

        if (this.y < this.radius) {
            this.y = this.radius;
            this.ySpeed *= -this.damping;
        }

        for (let obstacle of obstacles) {
            if (this.x > obstacle.x - this.radius &&
                this.x < obstacle.x + obstacle.width + this.radius &&
                this.y > obstacle.y - this.radius &&
                this.y < obstacle.y + obstacle.height + this.radius) {

                this.ySpeed *= -1;
            }
        }
    }

    display() {
        fill(this.color);
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    }
}

class Obstacle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    display() {
        fill(150);
        rect(this.x, this.y, this.width, this.height);
    }
}
