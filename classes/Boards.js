// Create Super Class...
class Board {
  constructor() {
    this.currentRound = 1;
    // Keep track of rounds won or lost in game
    this.roundsWon = 0;
    this.roundsLost = 0;
}
  // Getters and setters for current round
  incrementRound(){
    this.currentRound++;
  }

  // Function to return roundsWon or Lost
  // Will check if game over condition is met
  checkGameOver(){
    if(this.roundsLost === 3 || this.roundsWon === 3){
      const result = this.roundsLost > this.roundsWon ? "traitor" : "innocent";
      return result;
    }
  }

  get getRound(){
    return this.currentRound;
  }

  // Getter to add the total num of votes in a round
  get getNumOfVotes(){
    // Add success total and fail total and return
    return this.rounds[this.currentRound]["success"] + this.rounds[this.currentRound]["fail"];
  }

  get getPlayers(){
    // Get number of players from nested dictionary
    return this.rounds[this.currentRound]["players"];
  }

  get getSuccess(){
    return this.rounds[this.currentRound]["success"];
  }

  get getFail(){
    return this.rounds[this.currentRound]["fail"];
  }

  // Get status of all rounds
  get getRoundStatus(){
    return this.rounds;
  }

  set setMissionStatus(successOrFail){
    // Set status of mission as sucess or fail based on user input
    this.rounds[this.currentRound]["status"] = successOrFail;
    if (successOrFail == "success") this.roundsWon++;
    else this.roundsLost++;
  }

  set setMissionVotes(successOrFail){
    // Set status of mission as sucess or fail based on user input
    if(successOrFail === "🇾"){
      this.rounds[this.currentRound]["success"]++;
    }
    if(successOrFail === "🇳"){
      this.rounds[this.currentRound]["fail"]++;
    }
  }
}

class Board1 extends Board {
  constructor() {
      super();
      this.playersCount = 1;
      this.rounds = {
        "1": {
          "players": 1, "status": null, "success": 0, "fail": 0
        },
        "2": {
          "players": 1, "status": null, "success": 0, "fail": 0
        },
        "3": {
          "players": 1, "status": null, "success": 0, "fail": 0
        },
        "4": {
          "players": 1, "status": null, "success": 0, "fail": 0
        },
        "5": {
          "players": 1, "status": null, "success": 0, "fail": 0
        },
      }
  }
}
class Board2 extends Board {
  constructor() {
      super();
      this.playersCount = 2;
      this.rounds = {
        "1": {
          "players": 1, "status": null, "success": 0, "fail": 0
        },
        "2": {
          "players": 2, "status": null, "success": 0, "fail": 0
        },
        "3": {
          "players": 2, "status": null, "success": 0, "fail": 0
        },
        "4": {
          "players": 1, "status": null, "success": 0, "fail": 0
        },
        "5": {
          "players": 1, "status": null, "success": 0, "fail": 0
        },
      }
  }
}

class Board3 extends Board {
  constructor() {
      super();
      this.playersCount = 3;
      this.rounds = {
        "1": {
          "players": 3, "status": null, "success": 0, "fail": 0
        },
        "2": {
          "players": 2, "status": null, "success": 0, "fail": 0
        },
        "3": {
          "players": 2, "status": null, "success": 0, "fail": 0
        },
        "4": {
          "players": 2, "status": null, "success": 0, "fail": 0
        },
        "5": {
          "players": 1, "status": null, "success": 0, "fail": 0
        },
      }
  }
}
class Board4 extends Board {
  constructor() {
      super();
      this.playersCount = 4;
      this.rounds = {
        "1": {
          "players": 2, "status": null, "success": 0, "fail": 0
        },
        "2": {
          "players": 3, "status": null, "success": 0, "fail": 0
        },
        "3": {
          "players": 3, "status": null, "success": 0, "fail": 0
        },
        "4": {
          "players": 3, "status": null, "success": 0, "fail": 0
        },
        "5": {
          "players": 2, "status": null, "success": 0, "fail": 0
        },
      }
  }
}

class Board5 extends Board {
  constructor() {
      super();
      this.playersCount = 5;
      this.rounds = {
        "1": {
          "players": 2, "status": null, "success": 0, "fail": 0
        },
        "2": {
          "players": 3, "status": null, "success": 0, "fail": 0
        },
        "3": {
          "players": 2, "status": null, "success": 0, "fail": 0
        },
        "4": {
          "players": 3, "status": null, "success": 0, "fail": 0
        },
        "5": {
          "players": 3, "status": null, "success": 0, "fail": 0
        },
      }
  }
}

class Board6 extends Board {
  constructor() {
      super();
      this.playersCount = 6;
      this.rounds = {
        "1": {
          "players": 2, "status": null, "success": 0, "fail": 0
        },
        "2": {
          "players": 3, "status": null, "success": 0, "fail": 0
        },
        "3": {
          "players": 4, "status": null, "success": 0, "fail": 0
        },
        "4": {
          "players": 3, "status": null, "success": 0, "fail": 0
        },
        "5": {
          "players": 4, "status": null, "success": 0, "fail": 0
        },
      }
  }
}

class Board7 extends Board {
  constructor() {
      super();
      this.playersCount = 7;
      this.rounds = {
        "1": {
          "players": 2, "status": null, "success": 0, "fail": 0
        },
        "2": {
          "players": 3, "status": null, "success": 0, "fail": 0
        },
        "3": {
          "players": 3, "status": null, "success": 0, "fail": 0
        },
        "4": {
          "players": 4, "status": null, "success": 0, "fail": 0
        },
        "5": {
          "players": 4, "status": null, "success": 0, "fail": 0
        },
      }
  }
}

class Board8 extends Board {
  constructor() {
      super();
      this.playersCount = 8;
      this.rounds = {
        "1": {
          "players": 3, "status": null, "success": 0, "fail": 0
        },
        "2": {
          "players": 4, "status": null, "success": 0, "fail": 0
        },
        "3": {
          "players": 4, "status": null, "success": 0, "fail": 0
        },
        "4": {
          "players": 5, "status": null, "success": 0, "fail": 0
        },
        "5": {
          "players": 5, "status": null, "success": 0, "fail": 0
        },
      }
  }
}

module.exports = {
    Board1,
    Board2,
    Board3,
    Board4,
    Board5,
    Board6,
    Board7,
    Board8
}