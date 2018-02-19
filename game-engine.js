document.addEventListener('DOMContentLoaded', () => {
    // to do:
    // 1. smoother rendering
    // 2. Different difficulties
    // 3. Snake can eat himself on easy


    class Game {
        constructor() {
            this.canvas = document.querySelector('#myCanvas');
            this.ctx = this.canvas.getContext('2d');
            this.score = 0;
            this.size = 5;
            this.speed = 50;
            this.gameOn = false;
            this.addMovementListeners();
        }

        render() {
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.snake.location.forEach((element) => {
                this.ctx.fillStyle = "black";
                this.ctx.fillRect(element.x, element.y, this.size, this.size);
            });

            this.ctx.fillStyle = "red";
            this.ctx.fillRect(this.apple.location.x, this.apple.location.y, this.size, this.size);

        }

        addMovementListeners() {
            document.addEventListener('keydown', (e) => {
                switch (e.code) {
                    case "KeyW":
                        if (this.snake.previousDirection !== "down") {
                            this.snake.currentDirection = "up";
                        }
                        break;
                    case "KeyS":
                        if (this.snake.previousDirection !== "up") {
                            this.snake.currentDirection = "down";
                        }
                        break;
                    case "KeyD":
                        if (this.snake.previousDirection !== "left") {
                            this.snake.currentDirection = "right";
                        }
                        break;
                    case "KeyA":
                        if (this.snake.previousDirection !== "right") {
                            this.snake.currentDirection = "left";
                        }
                        break;
                    case "Enter":
                        if (!this.gameOn) {
                            this.startGame();
                        }
                }
            });
        }

        eat() {
            this.snake.elementsToAdd += 5;
            this.score += this.apple.points;
            document.querySelector('#score').querySelector('span').innerText = this.score;
            this.apple = new Apple;

        }

        prepareGame() {
            this.snake = new Snake;
            this.apple = new Apple;
            this.render();
        }

        startGame() {
            this.prepareGame();
            this.score = 0;
            this.gameTimer = setInterval(() => {this.snake.move()}, this.speed);
            document.querySelector('#score').querySelector('span').innerText = 0;
            document.querySelector('#start-game').style.display = 'none';
            document.querySelector('#try-again').style.display = 'none';
            document.querySelector('#score').classList.add('in-game');
            document.querySelector('#score').classList.remove('after-game');
            this.gameOn = true;
        }

        endGame() {
            clearInterval(this.gameTimer);
            // this.ctx.fillStyle = "red";
            // this.ctx.fillRect(this.snake.location[0].x, this.snake.location[0].y, this.size, this.size);
            document.querySelector('#try-again').style.display = 'block';
            document.querySelector('#score').classList.add('after-game');
            document.querySelector('#score').classList.remove('in-game');
            this.gameOn = false;
        }
    }




    class Snake {
        constructor() {
            this.elementsToAdd = 0;
            this.location = [];
            for (let i=0; i<4; i++) {
                this.location.push({x: game.canvas.width / 2, y: (game.canvas.height / 2 +(game.size * i))});
            }
            this.currentDirection = "up";
            this.previousDirection = "up";

        }

        move() {
            let snakeHead = Object.assign({}, this.location[0]);
            if (snakeHead.x === game.apple.location.x && snakeHead.y === game.apple.location.y) {
                game.eat();
            }

            switch (this.currentDirection) {
                case "up":
                    snakeHead.y -= game.size;
                    break;
                case "down":
                    snakeHead.y += game.size;
                    break;
                case "right":
                    snakeHead.x += game.size;
                    break;
                case "left":
                    snakeHead.x -= game.size;
                    break;
            }

            if (snakeHead.x < 0 || snakeHead.x > game.canvas.width-(game.size) || snakeHead.y < 0 || snakeHead.y > game.canvas.height-(game.size) || this.doesCollide(snakeHead)) {
                game.endGame();
                return false;
            }

            this.location.unshift(snakeHead);
            this.previousDirection = this.currentDirection;
            if (this.elementsToAdd===0) {
                this.location.pop();
            } else {
                this.elementsToAdd -= 1;
            }
            game.render();
        }

        doesCollide(arg) {
            return this.location.some((element) => {
                return (element.x === arg.x && element.y === arg.y)
            });
        }
    }

    class Apple {
        constructor() {
            this.location = this.newLocation();
            this.points = 10;
        }

        newLocation() {
            while (true) {
                let x = parseInt(Math.random() * (game.canvas.width / game.size)) * game.size;
                let y = parseInt(Math.random() * (game.canvas.height / game.size)) * game.size;

                if (!game.snake.location.some((element) => {
                        return (element.x === x && element.y === y)
                    })) {
                    return {x: x, y: y};
                }
            }
        }

    }

    let game = new Game;
});