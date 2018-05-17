document.addEventListener('DOMContentLoaded', () => {
    // to do:
    // 0. Make classes prettier
    // 1. Snake can eat himself
    // 2. Snake can go through walls


    class Game {
        constructor() {
            this.canvas = document.querySelector('#myCanvas');
            this.ctx = this.canvas.getContext('2d');
            this.score = 0;
            this.size = 10;
            this.speed = 0;
            this.direction = "up";
            this.wallWalkThrough = false;
            this.tailEat = false;
            this.gameOn = false;
            this.addOptionsListeners();
            this.addMovementListeners();
        }

        initialRender() {
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = "black";
            this.snake.body.forEach((element) => {
                this.ctx.fillRect(element.x, element.y, this.size, this.size);
            });

            this.ctx.fillStyle = "red";
            this.ctx.fillRect(this.apple.body.x, this.apple.body.y, this.size, this.size);
        }

        async moveRender() {
            for (let i = 0; i < game.size; i++) {
                this.headRender(i);
                this.tailRender(i);
                // await delay(this.speed);
                if (i === (game.size - 1)) {
                    if (this.snake.elementsToAdd === 0) {
                        this.snake.body.pop();
                    } else {
                        this.snake.elementsToAdd -= 1;
                    }
                }
            }
            this.move();
        }

        async move() {
            let snakeHead = Object.assign({}, this.snake.body[0]);
            snakeHead.direction = this.direction;


            if (snakeHead.x === game.apple.body.x && snakeHead.y === game.apple.body.y) {
                this.eat();
            }

            if (snakeHead.x < 0 || snakeHead.x > game.canvas.width - (game.size) || snakeHead.y < 0 || snakeHead.y > game.canvas.height - (game.size)) {
                if (this.wallWalkThrough===false) {
                    this.endGame();
                    return false;
                } else {
                    console.log('wall walk through not done yet')
                }

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

            let collideIndex = this.snake.doesCollide(snakeHead);
            if (collideIndex !== -1) {
                if (this.tailEat===false) {
                    this.endGame();
                    return false;
                } else {
                    console.log('eating own tail not done yet');
                    console.log(collideIndex);
                    let toClear = this.snake.body.slice(collideIndex+1);
                    this.ctx.fillStyle = "white";
                    toClear.forEach((element) => {
                        this.ctx.fillRect(element.x, element.y, this.size, this.size);
                    });
                    this.snake.body.splice(collideIndex, this.snake.body.length-collideIndex);
                }
            }

            this.snake.body.unshift(snakeHead);
            this.moveRender();
        }

        headRender(frame) {
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
        }

        tailRender(frame) {
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
        }


        setSnakeSize(size) {
            this.size = parseInt(size);
        }

        setSnakeSpeed(speed) {
            this.speed = parseInt(speed);
        }

        addOptionsListeners() {
            document.querySelector('#option-pop').addEventListener('click', (e) => {
                if (document.querySelector('#options').style.display === 'none') {
                    document.querySelector('#options').style.display = 'block';
                } else {
                    document.querySelector('#options').style.display = 'none';
                }
            });

            document.querySelector('#options').addEventListener('click', (e) => {
               let parent = e.srcElement.parentElement;
               if (e.srcElement.className!=='option-name' && this.gameOn===false) {
                    parent.querySelectorAll('span').forEach((el, index) => {
                        if (index!==0) {
                            el.classList.remove('selected');
                        }
                    });
                    e.srcElement.classList.add('selected');
                    switch (parent.id) {
                        case 'option-size':
                            this.setSnakeSize(e.target.dataset.value);
                            break;
                        case 'option-speed':
                            this.setSnakeSpeed(e.target.dataset.value);
                            break;
                        case 'option-wall':
                            this.wallWalkThrough = !this.wallWalkThrough;
                            break;
                        case 'option-tail':
                            this.tailEat = !this.tailEat;
                            break;
                    }
               }
            });
        }


        addMovementListeners() {
            document.addEventListener('keydown', (e) => {
                switch (e.code) {
                    case "KeyW":
                        if (this.snake.body[0].direction !== "down") {
                            this.direction = "up";
                        }
                        break;
                    case "KeyS":
                        if (this.snake.body[0].direction !== "up") {
                            this.direction = "down";
                        }
                        break;
                    case "KeyD":
                        if (this.snake.body[0].direction !== "left") {
                            this.direction = "right";
                        }
                        break;
                    case "KeyA":
                        if (this.snake.body[0].direction !== "right") {
                            this.direction = "left";
                        }
                        break;
                    case "Enter":
                        if (!this.gameOn) {
                            this.startGame();
                        }
                        break;
                    case "KeyO":
                        console.log('xd');
                        this.move();
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
            this.snake = new Snake();
            this.apple = new Apple();
            this.initialRender();
        }

        startGame() {
            this.prepareGame();
            this.score = 0;
            this.gameOn = true;
            document.querySelector('#score').querySelector('span').innerText = 0;
            document.querySelector('#start-game').style.display = 'none';
            document.querySelector('#try-again').style.display = 'none';
            document.querySelector('#score').classList.add('in-game');
            document.querySelector('#score').classList.remove('after-game');
            this.move();
        }

        endGame() {
            this.gameOn = false;
            this.direction = 'up';
            document.querySelector('#try-again').style.display = 'block';
            document.querySelector('#score').classList.add('after-game');
            document.querySelector('#score').classList.remove('in-game');
        }
    }




    class Snake {
        constructor() {
            this.elementsToAdd = 0;
            this.body = [];
            for (let i = 0; i < 20; i++) {
                this.body.push({x: game.canvas.width / 2, y: (game.canvas.height / 2 + i * game.size), direction: "up"});
            }
        }

        doesCollide(arg) {
            let collisionIndex = -1;
            this.body.forEach((element, index) => {
                if (element.x === arg.x && element.y === arg.y) {
                    collisionIndex = index;
                    return true;
                }
            });
            return collisionIndex;
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

    function delay (ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        });
    }

    let game = new Game;
});