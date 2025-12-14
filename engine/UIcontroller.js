export class UIcontroller {

    constructor(gameEngine) {

        this.engine = gameEngine
        this.overlay = null
        this.menubar = null
    }

    init() {

        this.overlay = document.createElement("div")

        //styling overlay
        this.overlay.style.position = "absolute"
        this.overlay.style.backgroundColor = "rgb(0,0,0,.7)"
        this.overlay.style.top = "0"
        this.overlay.style.left = "0"
        this.overlay.style.width = "100%"
        this.overlay.style.height = "100%"
        this.overlay.style.display = "flex"
        this.overlay.style.flexDirection = "column"
        this.overlay.style.justifyContent = "center"
        this.overlay.style.alignItems = "center"
        this.overlay.style.color = "#FFF"
        this.overlay.style.fontFamily = "sans-serif"
        if(innerWidth < 600) {
            this.overlay.style.fontSize = "3.5vw"
         }else{
            this.overlay.style.fontSize = "1.5vw";
         }
       
        this.overlay.style.zIndex = "10"

        //overlay content
        this.overlay.innerHTML = `
        
            <h1 style="color:tomato; text-shadow:2px 2px 3px #000">♠♥ Klondike Solitaire ♦♣</h1>
             <p>Sleep kaarten om te spelen.</p>
                <p>Dubbelklik voor automatische bewegingen.</p>
                <button id="startGameBtn" style="
                    margin-top:20px; padding:10px 20px; font-size:18px; cursor:pointer; background-color:gold;border:none;border-radius:10px;
                ">Spel starten</button>
        
        `

        document.body.appendChild(this.overlay)

        document.getElementById("startGameBtn").addEventListener("click", () => {

            this.startGame()
        })
    }

    startGame() {

        this.overlay.style.display = "none"
        this.engine.canvas.style.filter = "none"
        this.engine.enabled = true
        this.engine.canvasRenderer.render()
    }

    CreateMenuBar() {

        //menubar
        this.menubar = document.createElement("div")
        this.menubar.style.position = "absolute"
        this.menubar.style.bottom = "0"
        this.menubar.style.width = "100%"
        this.menubar.style.display = "flex"
        this.menubar.style.flexDirection = "row"
        this.menubar.style.padding = "10px"

        //controlbuttons
        let resetbutton = document.createElement("button")
        resetbutton.style.padding = "8px 10px";
        resetbutton.style.fontSize = "16px";
        resetbutton.style.cursor = "pointer";
        resetbutton.style.color = "#fff";
        resetbutton.style.fontWeight = "bold";
        resetbutton.style.letterSpacing = "1px";
        resetbutton.style.textShadow = "0 1px 2px rgba(0,0,0,.8)";
        resetbutton.style.border = "2px solid #d4af37";
        resetbutton.style.borderRadius = "10px";
        resetbutton.style.background = "linear-gradient(180deg, #ffdd55, #d4af37)";
        resetbutton.style.boxShadow = "0 4px 12px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,0.4)";
        resetbutton.style.transition = "all 0.2s ease-in-out";
        resetbutton.style.fontFamily = "'Segoe UI', sans-serif";
        resetbutton.textContent = "nieuw spel"

        resetbutton.onmouseenter = () => {
            resetbutton.style.transform = "translateY(-2px)";
            resetbutton.style.boxShadow = "0 6px 16px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,0.4)";
            resetbutton.style.background = "linear-gradient(180deg, #ffe680, #e0b84b)";
        };

        resetbutton.onmouseleave = () => {
            resetbutton.style.transform = "translateY(0)";
            resetbutton.style.boxShadow = "0 4px 12px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,0.4)";
            resetbutton.style.background = "linear-gradient(180deg, #ffdd55, #d4af37)";
        };

        resetbutton.onmousedown = () => {
            resetbutton.style.transform = "translateY(2px)";
            resetbutton.style.boxShadow = "0 2px 8px rgba(0,0,0,.6)";
        };

        resetbutton.onmouseup = () => {
            resetbutton.style.transform = "translateY(-1px)";
            resetbutton.style.boxShadow = "0 5px 14px rgba(0,0,0,.6)";
        };


        resetbutton.addEventListener("click", () => {

            this.engine.foundation = []
            this.engine.tableau = []
            this.engine.deck.cards = [];
            this.engine.waste.cards = [];

            //create card deck
            this.engine.CreateDeck()
            //shuffle card deck
            this.engine.shuffleDeck()
            //create foundation
            this.engine.createFoundation()
            //create tableau
            this.engine.createTableau()

            this.engine.canvasRenderer.confettiID = null
            this.engine.canvasRenderer.particles = []
            this.engine.gameOver = false

            this.engine.canvasRenderer.render()


        })

        this.menubar.appendChild(resetbutton)
        document.body.appendChild(this.menubar)
    }

}