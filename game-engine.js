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
            this.size = 10;
            this.speed = 1;
            this.gameOn = false;
            this.addMovementListeners();
        }

        initialRender() {
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.snake.body.forEach((element) => {
                this.ctx.fillStyle = "black";
                this.ctx.fillRect(element.x, element.y, this.size, this.size);
            });

            this.ctx.fillStyle = "red";
            this.ctx.fillRect(this.apple.body.x, this.apple.body.y, this.size, this.size);
        }

        async moveRender() {
            for (let i = 0; i < game.size; i++) {
                await this.headRender(i);
                await this.tailRender(i);
                if (i === (game.size-1)) {
                    if (this.snake.elementsToAdd === 0) {
                        this.snake.body.pop();
                    } else {
                        this.snake.elementsToAdd -= 1;
                    }
                }
            }
            this.snake.move();
        }

        headRender(frame) {
            return new Promise((resolve) => {
                let snakeLength = this.snake.body.length;
                let head = this.snake.body[0];

                this.ctx.fillStyle = "black";

                switch (head.direction) {
                    case "up":
                        this.ctx.fillRect(head.x, (head.y + this.size - frame - 1), this.size, 1);
                        break;
                    case "left":
                        this.ctx.fillRect((head.x + this.size - frame - 1), head.y, 1, this.size);
                        break;
                    case "down":
                        this.ctx.fillRect(head.x, (head.y + frame), this.size, 1);
                        break;
                    case "right":
                        this.ctx.fillRect((head.x + frame), head.y, 1, this.size);
                        break;
                }
                setTimeout(() => resolve('Moved head by 1 frame'), game.speed);
            });
        }

        tailRender(frame) {
            return new Promise((resolve) => {
                let snakeLength = this.snake.body.length;
                let tail = this.snake.body[snakeLength - 1];

                if (this.snake.elementsToAdd === 0) {
                    this.ctx.fillStyle = 'white';
                } else {
                    this.ctx.fillStyle = 'black';
                }

                switch (this.snake.body[snakeLength - 2].direction) {
                    case "up":
                        this.ctx.fillRect(tail.x, (tail.y + this.size - frame - 1), this.size, 1);
                        break;
                    case "left":
                        this.ctx.fillRect((tail.x + this.size - frame - 1), tail.y, 1, this.size);
                        break;
                    case "down":
                        this.ctx.fillRect(tail.x, (tail.y + frame), this.size, 1);
                        break;
                    case "right":
                        this.ctx.fillRect((tail.x + frame), tail.y, 1, this.size);
                        break;
                }
                setTimeout(() => resolve('Moved tail by 1 frame'), game.speed);
            });
        }

        addMovementListeners() {
            document.addEventListener('keydown', (e) => {
                switch (e.code) {
                    case "KeyW":
                        if (this.snake.previousDirection !== "down") {
                            this.snake.direction = "up";
                        }
                        break;
                    case "KeyS":
                        if (this.snake.previousDirection !== "up") {
                            this.snake.direction = "down";
                        }
                        break;
                    case "KeyD":
                        if (this.snake.previousDirection !== "left") {
                            this.snake.direction = "right";
                        }
                        break;
                    case "KeyA":
                        if (this.snake.previousDirection !== "right") {
                            this.snake.direction = "left";
                        }
                        break;
                    case "Enter":
                        if (!this.gameOn) {
                            this.startGame();
                        }
                        break;
                    case "KeyO":
                        console.log('xd');
                        this.snake.move();
                }
            });
        }

        eat() {
            this.snake.elementsToAdd += 3;
            this.score += this.apple.points;
            document.querySelector('#score').querySelector('span').innerText = this.score;
            this.apple = new Apple;
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(this.apple.body.x, this.apple.body.y, this.size, this.size);

        }

        prepareGame() {
            this.snake = new Snake;
            this.apple = new Apple;
            this.initialRender();
        }

        startGame() {
            this.prepareGame();
            this.score = 0;
            this.gameOn = true;
            this.snake.move();
            document.querySelector('#score').querySelector('span').innerText = 0;
            document.querySelector('#start-game').style.display = 'none';
            document.querySelector('#try-again').style.display = 'none';
            document.querySelector('#score').classList.add('in-game');
            document.querySelector('#score').classList.remove('after-game');
        }

        endGame() {
            document.querySelector('#try-again').style.display = 'block';
            document.querySelector('#score').classList.add('after-game');
            document.querySelector('#score').classList.remove('in-game');
            this.gameOn = false;
            console.log(this.snake.body);
        }
    }




    class Snake {
        constructor() {
            this.elementsToAdd = 0;
            this.body = [];
            for (let i = 0; i < 6; i++) {
                this.body.push({x: game.canvas.width / 2, y: (game.canvas.height / 2 + i * game.size), direction: "up"});
            }
            this.direction = "up";
            this.previousDirection = "up";

        }

        move() {
            let snakeHead = Object.assign({}, this.body[0]);
            if (snakeHead.x === game.apple.body.x && snakeHead.y === game.apple.body.y) {
                game.eat();
            }

            switch (this.direction) {
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

            snakeHead.direction = this.direction;

            if (snakeHead.x < 0 || snakeHead.x > game.canvas.width - (game.size) || snakeHead.y < 0 || snakeHead.y > game.canvas.height - (game.size) || this.doesCollide(snakeHead)) {
                game.endGame();
                return false;
            }

            this.previousDirection = this.direction;

            this.body.unshift(snakeHead);
            game.moveRender();
        }

        doesCollide(arg) {
            return this.body.some((element) => {
                return (element.x === arg.x && element.y === arg.y)
            });
        }
    }

    class Apple {
        constructor() {
            this.body = this.newLocation();
            this.points = 10;
        }

        newLocation() {
            while (true) {
                let x = parseInt(Math.random() * (game.canvas.width / game.size)) * game.size;
                let y = parseInt(Math.random() * (game.canvas.height / game.size)) * game.size;

                if (!game.snake.body.some((element) => {
                        return (element.x === x && element.y === y)
                    })) {
                    return {x: x, y: y};
                }
            }
        }

    }

    let game = new Game;
});