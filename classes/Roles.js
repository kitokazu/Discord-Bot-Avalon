class Innocent {
  constructor() {
      this.name = "Innocent";
      this.description = "You are an innocent. The Innocent wins the game if three Missions are completed successfully.";
      this.type = "innocent";
  }
}

class Merlin {
    constructor() {
        this.name = "Merlin";
        this.description = "The Merlin is able to see who the traitors are.";
        this.type = "innocent";
    }
  }

  class Traitor {
    constructor() {
        this.name = "Traitor";
        this.description = "The traitors win if three missions fail. Traitors can also win if the Innocent are unable to organize the Mission Team at any point in the game (5 failed votes on a single mission) ";
        this.type = "traitor";
    }
  }

  class Assassin {
    constructor() {
        this.name = "Assassin";
        this.description = "If you find and kill the Merlin, the traitors win.";
        this.type = "traitor";
    }
  }


  module.exports = {
    Innocent,
    Merlin,
    Traitor,
    Assassin,
  }