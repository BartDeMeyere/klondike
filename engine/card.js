export class Card {

    constructor(suit, value, x, y, width, height) {

        this.suit = suit
        this.value = value
        this.x = x
        this.y = y
        this.oldx = this.x
        this.oldy = this.y
        this.offset = 10
        this.width = width
        this.height = height
        this.radius = this.width / 10
        this.turned = false
        this.color = (this.suit === '♦' || this.suit === '♥') ? 'red' : 'black';

        //sliding target  tableau
        this.targetX = null
        this.targetY = null

    }

    getRank() {

        switch (this.value) {

            case 'J': return 11;
            case 'Q': return 12;
            case 'K': return 13;
            case 'A': return 1;

        }

        return parseInt(this.value)
    }

    draw(ctx, dragging) {

        ctx.save()

        if (dragging) {

            ctx.shadowColor = "rgba(0,0,0,0.7)";
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
        }

        if (!this.turned) {

            ctx.beginPath()
            ctx.strokeStyle = "black";
            ctx.fillStyle = "#0AF"
            ctx.lineWidth = 3
            ctx.roundRect(this.x, this.y, this.width, this.height, this.radius)
            ctx.fill()
            ctx.stroke()
            ctx.closePath()

            ctx.save()
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2)
            ctx.shadowColor = "rgba(0,0,0,0.9)";
            ctx.shadowBlur = 10;
            ctx.font = "bold " + this.width + "px Segoe UI";
            // ctx.fillStyle = "#0AE";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.suit, 0, 0);
            ctx.restore()

        } else {

            //draw the card
            ctx.save()
            ctx.beginPath()
            ctx.fillStyle = "#FFF"
            ctx.strokeStyle = "#000"
            ctx.lineWidth = 3
            ctx.roundRect(this.x, this.y, this.width, this.height, this.radius)
            ctx.fill()
            ctx.stroke()
            ctx.closePath()
            ctx.restore()

            //draw suit in center of the card
            ctx.save()
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2)
            ctx.beginPath()

            ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 10;
            ctx.shadowOffsetY = 10;

            ctx.fillStyle = this.color
            ctx.font = this.width * .8 + "px sans serif"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(this.suit, 0, 0)
            ctx.closePath()
            ctx.restore()

            let paddingX = this.width * 0.05;
            let paddingY = this.height * 0.03;

            //draw value card upper left corner
            ctx.save()
            ctx.translate(this.x, this.y)
            ctx.beginPath()

            ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 5
            ctx.shadowOffsetY = 5;

            ctx.fillStyle = this.color
            ctx.font = this.width * 0.2 + "px sans-serif"
            ctx.textAlign = "left"
            ctx.textBaseline = "top"
            ctx.fillText(this.value, paddingX, paddingY)
            ctx.closePath()
            ctx.restore()

            //draw value card bottom right corner
            ctx.save()
            ctx.translate(this.x + this.width - paddingX, this.y + this.height - paddingY)
            ctx.rotate(Math.PI)
            ctx.beginPath()

            ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;

            ctx.fillStyle = this.color
            ctx.font = this.width * 0.2 + "px sans serif"
            ctx.textAlign = "left"
            ctx.textBaseline = "top"
            ctx.fillText(this.value, 0, 0)
            ctx.closePath()
            ctx.restore()

        }

        ctx.restore()

    }

    contains(x, y) {
        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
        );
    }

}