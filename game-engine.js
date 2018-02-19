document.addEventListener('DOMContentLoaded', () => {
    // to do:
    // 0. fix crash bug (if you go up and click left/right and down really quickly, you attempt to move backwards <into yourself>);
    // 1. smoother rendering
    // 2. replay option
    // 3. Different difficulties
    // 4. Snake can eat himself on easy


    class Game {
        constructor() {
            this.canvas = document.querySelector('#myCanvas');
            this.ctx = this.canvas.getContext('2d');
            this.score = 0;
            this.size = 5;
            this.speed = 50;
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
                }
            });
        }

        eat() {
            this.snake.elementsToAdd += 5;
            this.score += game.apple.points;
            document.querySelector('#score').innerText = this.score;
            this.apple = new Apple;

        }

        startGame() {
            game.snake = new Snake;
            game.apple = new Apple;
            this.gameTimer = setInterval(() => {game.snake.move()}, this.speed);
        }

        endGame() {
            clearInterval(this.gameTimer);
            // this.ctx.fillStyle = "red";
            // this.ctx.fillRect(this.snake.location[0].x, this.snake.location[0].y, this.size, this.size);
            alert('Game over!\nYour final score was: ' + this.score);
        }
    }




    class Snake {
        constructor() {
            this.elementsToAdd = 0;
            this.location = [];
            for (let i=0; i<4; i++) {
                this.location.push({x:240, y:(135+(game.size*i))});
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
                let x = parseInt(Math.random() * (480 / game.size)) * game.size;
                let y = parseInt(Math.random() * (270 / game.size)) * game.size;

                if (!game.snake.location.some((element) => {
                        return (element.x === x && element.y === y)
                    })) {
                    return {x: x, y: y};
                }
            }
        }

    }

    let game = new Game;
    game.startGame();

});