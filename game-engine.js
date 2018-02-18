document.addEventListener('DOMContentLoaded', () => {

    class snake {
        constructor() {
            this.currentDirection = "up";
            this.elementsToAdd = 0;
            this.size = 5;
            this.location = [];
            this.speed = 50;
            this.score = 0;
            for (let i=0; i<4; i++) {
                this.location.push({x:240, y:(135+(this.size*i))});
            }
            this.addMovementListeners();
        }

        move() {
            let snakeHead = Object.assign({}, this.location[0]);
            if (snakeHead.x === apple.location.x && snakeHead.y === apple.location.y) {
                this.elementsToAdd += 5;
                this.score += apple.points;
                document.querySelector('#score').innerText = this.score;
                apple.eat();
            }
            switch (this.currentDirection) {
                case "up":
                    snakeHead.y -= this.size;
                    break;
                case "down":
                    snakeHead.y += this.size;
                    break;
                case "right":
                    snakeHead.x += this.size;
                    break;
                case "left":
                    snakeHead.x -= this.size;
                    break;
            }

            if (snakeHead.x < 0 || snakeHead.x > 480-(this.size) || snakeHead.y < 0 || snakeHead.y > 270-(this.size) || this.doesCollide(snakeHead)) {
                this.endGame();
                return false;
            }

            this.location.unshift(snakeHead);
            if (this.elementsToAdd===0) {
                this.location.pop();
            } else {
                this.elementsToAdd -= 1;
            }
            this.render();
        }

        render() {
            let canvas = document.querySelector('#myCanvas');
            let ctx = canvas.getContext('2d');
            let canvasData = ctx.createImageData(canvas.width, canvas.height);
            this.location.forEach((element) => {
                for (let i = 0; i<this.size; i++) {
                    for (let j = 0; j<this.size; j++) {
                        canvasData.data[(element.x + i + (element.y + j) * 480) * 4 + 3] = 255;
                    }
                }
            });
            for (let i = 0; i<this.size; i++) {
                for (let j = 0; j<this.size; j++) {
                    canvasData.data[(apple.location.x + i + (apple.location.y + j) * 480) * 4] = 255;
                    canvasData.data[(apple.location.x + i + (apple.location.y + j) * 480) * 4 + 3] = 255;
                }
            }

            ctx.putImageData(canvasData, 0, 0);
        }

        addMovementListeners() {
            document.addEventListener('keydown', (e) => {
                switch (e.code) {
                    case "KeyW":
                        if (this.currentDirection !== "down") {
                            this.currentDirection = "up";
                        }
                        break;
                    case "KeyS":
                        if (this.currentDirection !== "up") {
                            this.currentDirection = "down";
                        }
                        break;
                    case "KeyD":
                        if (this.currentDirection !== "left") {
                            this.currentDirection = "right";
                        }
                        break;
                    case "KeyA":
                        if (this.currentDirection !== "right") {
                            this.currentDirection = "left";
                        }
                        break;
                }
            });
        }

        endGame() {
            clearInterval(startGame);
            alert('Game over!\nYour final score was: ' + this.score);
        }

        doesCollide(arg) {
            return snakeTest.location.some((element) => {
                return (element.x === arg.x && element.y === arg.y)
            });
        }
    }

    class apples {
        constructor() {
            this.location = this.newLocation();
            this.points = 10;
            this.newLocation();
        }

        eat() {
            this.location = this.newLocation();
        }

        newLocation() {
            while (true) {
                let x = parseInt(Math.random() * (480 / snakeTest.size)) * snakeTest.size;
                let y = parseInt(Math.random() * (270 / snakeTest.size)) * snakeTest.size;

                if (!snakeTest.location.some((element) => {
                    return (element.x === x && element.y === y)
                })) {
                    return {x: x, y: y};
                }
            }
        }

    }

    let snakeTest = new snake;
    let apple = new apples;
    snakeTest.render();
    let startGame = setInterval(snakeTest.move.bind(snakeTest), snakeTest.speed);
});