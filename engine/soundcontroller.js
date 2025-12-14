export class Soundcontroller {
    constructor() {
      this.sounds = {
        place: new Audio("engine/sounds/placeCard.mp3"),
        turnDeck: new Audio("engine/sounds/turnDeck.mp3")
      };

      for (let s of Object.values(this.sounds)) s.volume = 0.3;
    }
  
    play(name) {
      let sound = this.sounds[name];
      if (sound) {
        sound.currentTime = 0; // zodat het meteen opnieuw speelt
        sound.play();
      }
    }
  }