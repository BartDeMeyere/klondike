import { Card } from "./card.js"
import { Pile } from "./pile.js"
import { Renderer } from "./renderer.js"
import { MouseEvents } from "./mouseEvents.js"
import { UIcontroller } from "./UIcontroller.js"
import { Soundcontroller } from "./soundcontroller.js"

export class GameEngine {

    constructor() {

        this.dpr = devicePixelRatio || 1
        this.canvas = null
        this.ctx = null
        this.createCanvas()

        //card / pile settings
        this.suits = ['♠', '♥', '♦', '♣']
        this.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
        this.cardRatio = 88 / 63
        this.minimum = Math.min(this.canvas.width, this.canvas.height)
        //this.cardWidth = this.minimum / 7
        if (innerWidth < 800) {
            this.cardWidth = this.minimum / 8.5; // iets smaller
          } else {
            this.cardWidth = this.minimum / 7;
          }
        this.cardHeight = this.cardWidth * this.cardRatio
        this.cardRadius = this.cardWidth / 10
        this.cardOffset = this.cardWidth * .2
        this.selectedCards = []
        this.gameOver = false

        //activate clicking on canvas
        this.enabled = false

        //piles
        this.deck = new Pile(this.cardOffset, this.cardOffset, this.cardWidth, this.cardHeight)
        this.waste = new Pile(this.cardOffset * 2 + this.cardWidth, this.cardOffset, this.cardWidth, this.cardHeight)
        this.foundation = []
        this.tableau = []

        //create card deck
        this.CreateDeck()
        //shuffle card deck
        this.shuffleDeck()
        //create foundation
        this.createFoundation()
        //create tableau
        this.createTableau()
       
        //events
        this.events = new MouseEvents(this)
        this.events.init()

        //renderer
        this.canvasRenderer = new Renderer(this)
        this.canvasRenderer.render()
        //this.canvasRenderer.createConfetti()

        //UI controller
        this.UIcontroller = new UIcontroller(this)
        this.UIcontroller.init()
        this.UIcontroller.CreateMenuBar()

        //sound controller
        this.soundcontroller = new Soundcontroller()

    }

    createCanvas() {

        //document
        document.body.style.margin = "0"
        document.body.style.overflow = "hidden"
        document.body.style.backgroundColor = "#1A4715"
        //canvas
        this.canvas = document.createElement("canvas")
        this.ctx = this.canvas.getContext("2d")
        this.canvas.width = innerWidth * this.dpr
        this.canvas.height = innerHeight * this.dpr
        this.canvas.style.width = "100%"
        this.canvas.style.height = "100%"
        this.canvas.style.backgroundImage = "url('./engine/images/cardboard.png')"
        this.canvas.style.backgroundRepeat = "repeat"
        this.canvas.style.filter = "blur(10px)"
        document.body.insertBefore(this.canvas, document.body.firstChild)
    }

    CreateDeck() {

        for (let i = 0; i < this.suits.length; i++) {
            for (let j = 0; j < this.values.length; j++) {
                this.deck.cards.push(new Card(this.suits[i], this.values[j], this.deck.x, this.deck.y, this.cardWidth, this.cardHeight))
            }
        }
    }

    shuffleDeck() {

        for (let i = this.deck.cards.length - 1; i > 0; i--) {
            let index = Math.floor(Math.random() * (i + 1))
            let temp = this.deck.cards[i];
            this.deck.cards[i] = this.deck.cards[index];
            this.deck.cards[index] = temp;
        }

    }

    createFoundation() {

        let sx = this.cardWidth * 3 + this.cardOffset * 4
        let sy = this.cardOffset

        for (let i = 0; i < 4; i++) {

            this.foundation.push(new Pile(sx + i * (this.cardWidth + this.cardOffset), sy, this.cardWidth, this.cardHeight))
        }
    }

    createTableau() {

        let sx = this.cardOffset
        let sy = this.cardOffset * 3 + this.cardHeight
        let count = 1

        for (let i = 0; i < 7; i++) {

            let pile = new Pile(sx + i * (this.cardWidth + this.cardOffset), sy, this.cardWidth, this.cardHeight)

            for (let j = 0; j < count; j++) {

                let card = this.deck.cards.pop()
                card.x = pile.x
                card.y = pile.y + j * this.cardOffset
                card.oldx = card.x
                card.oldy = card.y
                pile.cards.push(card)
            }

            this.tableau.push(pile)
            pile.lastCard().turned = true
            count++
        }
    }

    checkWin(){

        for (let pile of this.foundation) {
            if (pile.cards.length < 13){

                this.gameOver = false 
                return false
            }
        }
        
        this.gameOver = true
        return true
    }

}