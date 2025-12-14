export class Pile {

    constructor(x, y, width, height) {

        this.cards = []
        this.x = x;
        this.y = y
        this.width = width
        this.height = height
        this.radius = this.width / 10
    }

    lastCard() {

        if (this.cards.length > 0) return this.cards[this.cards.length - 1]
    }

    removeLastCard() {

        if (this.cards.length > 0) this.cards.pop()
    }

    addCard(card) {

        this.cards.push(card)
    }

    isEmpty() {

        return this.cards.length === 0
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