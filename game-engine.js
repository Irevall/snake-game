document.addEventListener('DOMContentLoaded', () => {

    class snake {
        constructor() {
            this.currentDirection = "up";
            this.elementsToAdd = 0;
            this.location =  [{x:240, y:135}, {x:240, y:134}, {x:240, y:133}, {x:240, y:132}, {x:240, y:131}];
            console.log(this);
        }

        move() {
            let snakeHead = Object.assign({}, this.location[0]);

            switch (this.currentDirection) {
                case "up":
                    snakeHead.y -= 1;
                    break;
                case "down":
                    snakeHead.y += 1;
                    break;
                case "right":
                    snakeHead.x += 1;
                    break;z
                case "left":
                    snakeHead.x -= 1;
                    break;
            }

            this.location.unshift(snakeHead);
            if (this.elementsToAdd===0) {
                this.location.pop();
            } else {
                this.elementsToAdd -= 1;
            }
        }

        render() {
            let canvas = document.querySelector('#myCanvas');
            let ctx = canvas.getContext('2d');
            let canvasData = ctx.createImageData(canvas.width, canvas.height);

            this.location.forEach((element) => {
                canvasData.data[(element.x + element.y * 480) * 4 + 3] = 255;
            });

            ctx.putImageData(canvasData, 0, 0);
        }
    }

    let snakeTest = new snake;
    console.log(snakeTest);
    snakeTest.move();
    console.log(snakeTest);
    snakeTest.render();
});