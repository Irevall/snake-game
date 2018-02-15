document.addEventListener('DOMContentLoaded', () => {
    class snake {
        constructor() {
            this.currentDirection = "up";
            this.location =  [{x:0, y:0}, {x:0, y:1}, {x:0, y:2}];
            console.log(this);
        }

        move() {
            let snakeHead = Object.assign({}, this.location[0]);

            switch (this.currentDirection) {
                case "up":
                    snakeHead.y += 1;
                    break;
                case "down":
                    snakeHead.y -= 1;
                    break;
                case "right":
                    snakeHead.x += 1;
                    break;
                case "left":
                    snakeHead.x -= 1;
                    break;
            }

            this.location.unshift(snakeHead);
            this.location.pop();
        }
    }

    let snakeTest = new snake;
    console.log(snakeTest);
    snakeTest.move();
    console.log(snakeTest);
});