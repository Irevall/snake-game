document.addEventListener('DOMContentLoaded', () => {

    class snake {
        constructor() {
            this.currentDirection = "up";
            this.elementsToAdd = 0;
            this.size = 4;
            this.location = [];
            this.speed = 50;
            this.points = 0;
            for (let i=0; i<20; i++) {
                this.location.push({x:240, y:(135+this.size*i)});
            }
            this.addMovementListeners();
            console.log(this);
        }

        move() {
            let snakeHead = Object.assign({}, this.location[0]);
            if (snakeHead.x === apple.location.x && snakeHead.y === apple.location.y) {
                this.elementsToAdd += 20;
                console.log('fajnie!');
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
    }

    class apples {
        constructor() {
            this.location = {x: 240, y: 135};
        }
    }

    let snakeTest = new snake;
    let apple = new apples;
    console.log(apple);
    snakeTest.render();
    setInterval(snakeTest.move.bind(snakeTest), snakeTest.speed);
});