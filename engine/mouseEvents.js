export class MouseEvents {

    constructor(gameEngine) {

        this.engine = gameEngine
        this.dx = null
        this.dy = null
        this.sourcePile = null
        this.selectedIndex = null
        this.mouseDown = false
        this.mouse = { x: 0, y: 0 }
    }

    init() {

        this.engine.canvas.addEventListener("mousedown", (e) => {

            if (!this.engine.enabled) return

            this.mouseDown = true
            this.onClickDeck(this.mouse.x, this.mouse.y)
            this.onClickWaste(this.mouse.x, this.mouse.y)
            this.onClickTableau(this.mouse.x, this.mouse.y)
            this.engine.canvasRenderer.render()

        })

        this.engine.canvas.addEventListener("mousemove", (e) => {

            this.mouse.x = e.clientX * devicePixelRatio
            this.mouse.y = e.clientY * devicePixelRatio

            if (this.engine.selectedCards.length > 0 && this.mouseDown) {

                this.moveSelectedCards(this.mouse.x, this.mouse.y)

            }

            this.engine.canvasRenderer.render()

        })

        this.engine.canvas.addEventListener("mouseup", (e) => {

            this.mouseDown = false
            this.onReleaseOnFoundation(this.mouse.x, this.mouse.y);
            this.onReleaseTableau(this.mouse.x, this.mouse.y);

            this.engine.canvasRenderer.render()

            this.engine.checkWin()

            //this.engine.gameOver = true

            if (this.engine.gameOver) {
                this.engine.canvasRenderer.createConfetti()
                this.engine.enabled = false
            }

        })

        this.engine.canvas.addEventListener("dblclick", (e) => {

            this.autoMoveCards(this.mouse.x, this.mouse.y)
        })

        /* TOUCH EVENT HANDLING  */
        this.engine.canvas.addEventListener("touchstart", (e) => {

            e.preventDefault()

            if (!this.engine.enabled) return

            this.mouseDown = true
            let touch = e.touches[0];
            this.mouse.x = touch.clientX * devicePixelRatio;
            this.mouse.y = touch.clientY * devicePixelRatio;

            this.onClickDeck(this.mouse.x, this.mouse.y)
            this.onClickWaste(this.mouse.x, this.mouse.y)
            this.onClickTableau(this.mouse.x, this.mouse.y)
            this.engine.canvasRenderer.render()

        })

        this.engine.canvas.addEventListener("touchmove", (e) => {

            e.preventDefault()

            let touch = e.touches[0]
            this.mouse.x = touch.clientX * devicePixelRatio
            this.mouse.y = touch.clientY * devicePixelRatio

            if (this.engine.selectedCards.length > 0 && this.mouseDown) {

                this.moveSelectedCards(this.mouse.x, this.mouse.y)

            }

            this.engine.canvasRenderer.render()

        })

        this.engine.canvas.addEventListener("touchend", (e) => {

            this.mouseDown = false
            this.onReleaseOnFoundation(this.mouse.x, this.mouse.y);
            this.onReleaseTableau(this.mouse.x, this.mouse.y);

            this.engine.canvasRenderer.render()

            this.engine.checkWin()

            //this.engine.gameOver = true

            if (this.engine.gameOver) {
                this.engine.canvasRenderer.createConfetti()
                this.engine.enabled = false
            }

        })

    }

    onClickDeck(x, y) {

        if (this.engine.deck.contains(x, y)) {

            if (!this.engine.deck.isEmpty()) {

                let upperCard = this.engine.deck.lastCard()
                this.engine.waste.addCard(upperCard)
                upperCard.turned = true

                upperCard.x = this.engine.waste.x
                upperCard.y = this.engine.waste.y
                upperCard.oldx = upperCard.x
                upperCard.oldy = upperCard.y

                this.engine.soundcontroller.play("turnDeck")

                this.engine.deck.removeLastCard()

            } else {

                while (!this.engine.waste.isEmpty()) {

                    let upperCard = this.engine.waste.lastCard()
                    this.engine.deck.addCard(upperCard)
                    upperCard.turned = false
                    this.engine.waste.removeLastCard()

                    upperCard.x = this.engine.deck.x
                    upperCard.y = this.engine.deck.y
                    upperCard.oldx = upperCard.x
                    upperCard.oldy = upperCard.y
                }

            }
        }

    }

    onClickWaste(x, y) {

        if (this.engine.waste.contains(x, y) && !this.engine.waste.isEmpty()) {
            let card = this.engine.waste.lastCard()
            this.engine.selectedCards = [card]
            this.dx = x - card.x
            this.dy = y - card.y
            this.sourcePile = this.engine.waste
            this.selectedIndex = this.engine.waste.cards.length - 1

        }
    }

    onClickTableau(x, y) {

        this.engine.tableau.forEach(pile => {

            pile.cards.forEach((card, index) => {

                if (card.turned && card.contains(x, y)) {

                    this.selectedIndex = index
                    this.engine.selectedCards = pile.cards.slice(index)
                    this.dx = x - card.x
                    this.dy = y - card.y
                    this.sourcePile = pile
                }
            })
        });

    }

    canPlaceOnTableau(card, pile) {

        if (card && card.getRank() === 13 && pile.isEmpty()) {

            return true
        }

        let lastCard = pile.lastCard()
        if (lastCard && (card.color !== lastCard.color) && (card.getRank() === lastCard.getRank() - 1)) return true
    }

    onReleaseTableau(x, y) {

        let moved = false

        this.engine.tableau.forEach(pile => {

            let targetCard = pile.lastCard()
            let card = this.engine.selectedCards[0]

            if (pile.isEmpty() && pile.contains(x, y)) {

                if (this.canPlaceOnTableau(card, pile)) {

                    this.placeCards(this.sourcePile, pile)
                    moved = true
                    return
                }
            }

            if (targetCard && card && targetCard.contains(x, y)) {

                if (this.canPlaceOnTableau(card, pile)) {

                    this.placeCards(this.sourcePile, pile)
                    moved = true
                    return
                }
            }
        })

        if (!moved) this.moveCardsBack()
    }

    canPlaceOnFoundation(card, pile) {

        if (!card || !pile) return

        if (card && card.getRank() === 1 && pile.isEmpty()) {

            return true
        }

        let lastCard = pile.lastCard()
        if (lastCard && (card.suit === lastCard.suit) && (card.getRank() === lastCard.getRank() + 1)) return true

    }

    onReleaseOnFoundation(x, y) {

        if (this.engine.selectedCards === null) return

        let card = this.engine.selectedCards[0]

        this.engine.foundation.forEach(pile => {

            if (this.canPlaceOnFoundation(card, pile) && pile.contains(x, y)) {

                this.placeCards(this.sourcePile, pile)
                return
            }
        })

    }

    placeCards(sourcePile, targetPile) {

        if (!sourcePile || !targetPile) return

        let movingCards = sourcePile.cards.splice(this.selectedIndex, this.engine.selectedCards.length)

        movingCards.forEach((card, i) => {

            card.x = targetPile.x
            if (targetPile.lastCard()) {

                if (this.engine.foundation.includes(targetPile)) {

                    card.y = targetPile.lastCard().y

                } else {

                    card.y = targetPile.lastCard().y + this.engine.cardOffset
                    this.engine.soundcontroller.play("place")
                }


            } else {

                card.y = targetPile.y
                this.engine.soundcontroller.play("place")
            }

            card.oldx = card.x
            card.oldy = card.y
            targetPile.addCard(card)

        })

        if (!sourcePile.isEmpty()) {
            sourcePile.lastCard().turned = true

        }


        this.engine.selectedCards = []
        this.engine.selectedIndex = null
        this.sourcePile = null
    }


    moveSelectedCards(x, y) {

        for (let i = 0; i < this.engine.selectedCards.length; i++) {

            let currentCard = this.engine.selectedCards[i]
            currentCard.x = x - this.dx
            currentCard.y = y - this.dy + i * this.engine.cardOffset

        }
    }

    moveCardsBack() {

        let innerloop = () => {

            let done = true

            for (let i = 0; i < this.engine.selectedCards.length; i++) {

                let card = this.engine.selectedCards[i]

                let dx = card.oldx - card.x
                let dy = card.oldy - card.y


                if (Math.abs(dx) > .5 || Math.abs(dy) > .5) {
                    card.x += dx * .3
                    card.y += dy * .3
                    done = false;
                } else {
                    card.x = card.oldx
                    card.y = card.oldy
                }

            }

            this.engine.canvasRenderer.render()

            if (!done && !this.mouseDown) {
                requestAnimationFrame(innerloop);
            } else {

                this.engine.selectedCards = [];

            }
        }

        innerloop()
    }

    autoMoveCards(x, y) {

        let upperCard = null
        let targetPile = null
        let sourcePile = null
        let done = true
        let canAnimate = false

        if (!this.engine.waste.isEmpty() && this.engine.waste.contains(x, y)) {

            upperCard = this.engine.waste.lastCard()
            this.engine.selectedCards = [upperCard]
            this.selectedIndex = this.engine.waste.cards.length - 1
            sourcePile = this.engine.waste

            if (upperCard) {

                for (let pile of this.engine.foundation) {

                    if (this.canPlaceOnFoundation(upperCard, pile)) {

                        targetPile = pile
                        canAnimate = true
                        break;
                    }
                }

            }

        }

        if (!upperCard) {

            for (let pile of this.engine.tableau) {

                if (!pile.isEmpty()) {

                    let card = pile.lastCard()

                    if (card.contains(x, y)) {

                        upperCard = card
                        sourcePile = pile
                        this.engine.selectedCards = [upperCard]
                        this.selectedIndex = pile.cards.length - 1

                        for (let foundationPile of this.engine.foundation) {

                            if (this.canPlaceOnFoundation(upperCard, foundationPile)) {

                                targetPile = foundationPile
                                canAnimate = true
                                break;
                            }
                        }

                    }
                }
            }

        }


        //start animation
        let innerloop = () => {

            if (canAnimate) {

                let dx = targetPile.x - upperCard.x
                let dy = targetPile.y - upperCard.y

                if (Math.abs(dx) > .5 || Math.abs(dy) > .5) {
                    upperCard.x += dx * .3
                    upperCard.y += dy * .3
                    done = false;
                } else {
                    upperCard.x = targetPile.x
                    upperCard.y = targetPile.y
                    this.placeCards(sourcePile, targetPile);
                    done = true
                    canAnimate = false
                    this.engine.selectedCards = []
                    this.selectedIndex = null
                    upperCard = null
                }

                this.engine.canvasRenderer.render()
                requestAnimationFrame(innerloop)
            }

        }

        innerloop()

    }
} 