export class Renderer {

    constructor(gameEngine) {

        this.engine = gameEngine
        this.particles = []
        this.confettiAnimating = true 
        this.confettiId = null

    }

    drawEmptyPile(pile) {

        this.engine.ctx.save();
        this.engine.ctx.fillStyle = "rgba(123, 206, 128, 0.05)"; // zeer licht groen
        this.engine.ctx.roundRect(pile.x, pile.y, pile.width, pile.height, pile.radius);
        this.engine.ctx.fill();
        this.engine.ctx.restore();

        this.engine.ctx.beginPath()
        this.engine.ctx.strokeStyle = "#7BCE80"
        this.engine.ctx.lineWidth = 3
        this.engine.ctx.roundRect(pile.x, pile.y, pile.width, pile.height, pile.radius)
        this.engine.ctx.stroke()
        this.engine.ctx.closePath()
    }

    render() {

        this.engine.ctx.clearRect(0, 0, this.engine.canvas.width, this.engine.canvas.height)

        /* DRAW CARD DECK */
        if (this.engine.deck.isEmpty()) {

            //render empty deck
            this.drawEmptyPile(this.engine.deck)

        } else {

            //draw upper card
            let lastcard = this.engine.deck.lastCard()
            if (lastcard) {
                lastcard.draw(this.engine.ctx)
            }
        }

        /* DRAW WASTE DECK */
        if (this.engine.waste.isEmpty()) {

            //render empty waste
            this.drawEmptyPile(this.engine.waste)

        } else {

            this.engine.waste.cards.forEach(card => {

                card.draw(this.engine.ctx)
            })
        }

        /* DRAW FOUNDATION */
        this.engine.foundation.forEach(pile => {

            if (pile.isEmpty()) {

                //draw empty pile in foundation
                this.drawEmptyPile(pile)

            } else {

                //draw upper card
                let lastcard = pile.lastCard()
                if (lastcard) {
                    lastcard.draw(this.engine.ctx)
                }
            }

            this.engine.ctx.save();
            this.engine.ctx.fillStyle = "#FFF";
            this.engine.ctx.font = "24px sans-serif";
            this.engine.ctx.textAlign = "center";
            this.engine.ctx.textBaseline = "top";
            let text = pile.cards.length + "/13";
            this.engine.ctx.fillText(text, pile.x + pile.width / 2, pile.y - 30);
            this.engine.ctx.restore();

        });

        /* DRAW TABLEAU */
        this.engine.tableau.forEach(pile => {

            //draw empty pile in foundation
            this.drawEmptyPile(pile)

            for (let i = 0; i < pile.cards.length; i++) {

                let card = pile.cards[i]
                card.draw(this.engine.ctx)

            }

        });

        /* DRAW SELECTED CARDS */

        for (let i = 0; i < this.engine.selectedCards.length; i++) {

            let card = this.engine.selectedCards[i]
            card.draw(this.engine.ctx, true)
        }

    }

    createConfetti() {

        if (!this.engine.gameOver) return

        if(this.confettiAnimating)cancelAnimationFrame(this.confettiId)

        this.particles = []

        for (let i = 0; i < 500; i++) {

            this.particles.push(

                {
                    x: Math.random() * this.engine.canvas.width,
                    y: -100,
                    size: Math.random() * 15 + 2,
                    velY: Math.random() * 5 ,
                    velX: Math.random() - .5,
                    color: `hsl(${Math.random() * 360}, 80%, 60%)`,
                    rotation: Math.random() * 2 * Math.PI,
                    rotationspeed: (Math.random() - .5) * .2

                })
        }

        let ctx = this.engine.ctx
        this.confettiAnimating = true

        let animate = () => {

            this.render()

            this.particles.forEach(particle => {

                //draw particle
                ctx.save()
                ctx.translate(particle.x + particle.size / 2, particle.y + particle.size / 2)
                ctx.rotate(particle.rotation)
                ctx.beginPath()
                ctx.fillStyle = particle.color
                ctx.rect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
                ctx.fill()
                ctx.closePath()
                ctx.restore()

                if (particle.y > this.engine.canvas.height + 50) {

                    particle.x = Math.random() * this.engine.canvas.width
                    particle.y = -100
                }

                //particle movement
                particle.y += particle.velY
                particle.x += particle.velX 
                particle.rotation += particle.rotationspeed

            })

            this.confettiId = requestAnimationFrame(animate)
        }

        animate()

    }
}