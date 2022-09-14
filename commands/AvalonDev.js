// Import Roles
const Roles = require('../classes/Roles.js');
// Import Boards
const Boards = require('../classes/Boards.js');
const { Emoji } = require('discord.js');
var savedBotMsg;
var players = new Map();
var assignedPlayers = new Map();

// Global Variables
// Keeping track of emojis
const playerEmojis = {
  "1": "1️⃣",
  "2": "2️⃣",
  "3": "3️⃣",
  "4": "4️⃣",
  "5": "5️⃣",
  "6": "6️⃣",
  "7": "7️⃣",
  "8": "8️⃣",
  "9": "9️⃣",
  "10": "🔟",
}
const boardDict = {
  1: new Boards.Board1(),
  2: new Boards.Board2(),
  3: new Boards.Board5(),
  4: new Boards.Board4(),
  5: new Boards.Board5(),
  6: new Boards.Board5(),
  7: new Boards.Board5(),
  8: new Boards.Board5(),
  9: new Boards.Board5(),
  10: new Boards.Board5(),
}

// Variables for the current game
var traitors = [];
var merlin = "";
var leader;
var assignedUsers = new Array();
var firstLeaderPicked = false;
var leaderIndex = 0;
var board;
var gameInProgress = false;

function startGame(msg) {
  // Do not start a new game if one is already in progress.
  if (gameInProgress) return msg.channel.send('Game is already in progress.');
  // Variables for the current game
  traitors = [];
  merlin = "";
  leader;
  assignedUsers = new Array();
  firstLeaderPicked = false;
  leaderIndex = 0;
  // Reset the variables each time a new game is played
  msg.channel.send('Starting an Avalon Game! Click ✅ to join the game!')
  .then(botmsg => botmsg.react("✅"))
  .then(botmsg => savedBotMsg = botmsg);

}

function play(msg) {
  //Getting IDs of users who reacted
  // Do not start a new game if one is already in progress.
  if (gameInProgress) return msg.channel.send('Game is already in progress.');
  savedBotMsg.users.cache.map(user => {
    // Get rid of this line to add the bot itself
    if (!user.bot) {
      // Value must be of type user
      // Instead of having username, have it assign to a role
      players.set(user, user.username);
    }
  });
  var playerNames = [];
  for (let key of players.keys()) {
    playerNames.push(key.username);
  }
  // use players variable and turn it into assignedPlayers
  // USE assignedPlayers from now on, NOT players
  assignRoles(players);
  
  msg.channel.send(`Starting game with ${playerNames.join(" ")}`);
  gameInProgress = true;
  messageRoles(msg, assignedPlayers);

}


// MESSAGE USERS THEIR ROLES
function messageRoles(msg, assignedPlayers){
  
  // Get traitors & Merlin and assign to game
  for (let [user, role] of assignedPlayers) {
    if (role.name === "Merlin") {
      merlin = user.username;
    }
    if (role.type === "traitor") {
      traitors.push(user.username);
    }
  }
  //Loops through the map and gets the players and their respective roles
  for (let [user, role] of assignedPlayers) {
    user.send(`Your role is: ${role.name}. ${role.description}`);
    if (role.name === "Merlin" || role.type === "traitor") {
      user.send(`The traitors in the game are: ${traitors.join(", ")}.`);
    }
  }

  // Assign Board
  board = boardDict[assignedPlayers.size];
  createMission(msg, assignedPlayers);

}

// Main function looping through to check what point in the game it is
function createMission(msg, assignedPlayers){
  var missionMsg;
  // Comment for keeping track where we are in the mission
  msg.channel.send(`It is round ${board.getRound}`);
  // Assign leader index based on if this is the first leader or not
  if (!firstLeaderPicked) {
    // Assign a leader initially choosing randomly at start of game
    assignedUsers = Array.from(assignedPlayers.keys());
    leader = assignedUsers[Math.floor(Math.random() * assignedUsers.length)];
    leaderIndex = assignedUsers.indexOf(leader);
    firstLeaderPicked = true;
    // Increment leader initially
    leaderIndex++;
  } else {
    // If leader is last element in array, reset to 0 (counter clockwise)
    if (leaderIndex >= assignedUsers.length) {
      leaderIndex = 0;
      leader = assignedUsers[leaderIndex];
      leaderIndex++;
    } else {
      //Make sure the order is correct for Lines 115&116
      leader = assignedUsers[leaderIndex];
      leaderIndex++;
    }
  }
  msg.channel.send(`${leader.username} is the leader of the mission. (Index ${leaderIndex})`);
  msg.channel.send(`Select ${board.getPlayers} players for the mission.\n${displayPlayers(assignedPlayers)}`)
  .then(botmsg => {
    missionMsg = botmsg;
    for (let index = 1; index <= board.playersCount; index++) {
      botmsg.react(playerEmojis[index]);
    }
    // Pass message to new function for reading reactions
    readReactions(missionMsg, leader.username)
  })

}

// This function takes botmsg as input
// And will await required number of reactions until it progresses
function readReactions(msg, leader){
  // const filter = (reaction, user) => {
  //   return reaction.emoji.name ;
  // };
  // A number based on the number of players that need to be picked
  var relationDict = readReactionsDict(assignedPlayers);
  var requiredVotesToProceed = board.getPlayers;
  var currentReactions = 0;
  // Result is players that are selected for mission
  // Must be player objects
  var result = {};
  const filter = (reaction, user) => {
    // Make sure reactions are in list of reactions
    // Return this to leader when done testing
    // return user.username == leader;
    // Must check if emoji in playerEmojis
    
    return (user.username == leader) && Object.values(playerEmojis).includes(reaction.emoji.name);
  };
  
  // Make sure you set dispose to true to collect removed
  const collector = msg.createReactionCollector(filter, { time: 300000, dispose: true });
  
  // Collect for recieving 
  collector.on('collect', (reaction, user) => {
    // Once we get two reactions
    // Proceed
    // board.getPlayers is number of players in current round
    // Get type of reaction
    // Add result with key of emoji and value of player
    result[reaction.emoji.name] = relationDict[reaction.emoji.name];
    currentReactions++;
    // playersMap += userNumReacted;
    if (currentReactions == requiredVotesToProceed){
      // Listener should end here once condition is met
      // But AFK timer persists, this may cause issue in future
      collector.stop();
      return confirmMission(msg, result);
    }
  });

  // Collect for removing remojis
  collector.on('remove', (reaction, user) => {
    // Delete key from dictionary when emoji is removed
    delete result[reaction.emoji.name];
    currentReactions--;
  });
  
  // Collector end must be forced manually later
  collector.on('end', collected => {
    if (!(currentReactions == requiredVotesToProceed)){
      // Listener should end here once condition is met
      // But AFK timer persists, this may cause issue in future
      return createMission(msg, assignedPlayers);
    }
  
  });

}

// Helper function for readReactions
// Creates a dictionary of players assigned to number
function readReactionsDict(assignedPlayers){
  // Result returns a dictionary mapping players
  var result = {};
  // Create our own index because JS does not provide
  var index = 1;
  // Loop through Map datastructure
  // This could be done via casting Map as Array and looping normally
  for (let player of assignedPlayers.keys()){
    // Convert index number to emoji for key
    result[playerEmojis[index]] = player;
    index++;
  }
  return result;
}

function confirmMission(msg, selectedPlayersDict){
  // Selected Players must turn to array to check assignedPlayers roles
  var selectedPlayers = Object.values(selectedPlayersDict);
  var playerNames = "";
  var thisMessage;
  selectedPlayers.forEach(player => {
    playerNames += player.username + " ";
  });
    // Once team is confirmed, message the channel and display who was selected on team
  msg.channel.send(`The selected players for the mission are: ${playerNames}
  React with (Y) to accept the teams. React with (N) to reject the teams.`)
  .then(botmsg => {
    // Make this new message the current message for round
    thisMessage = botmsg;
    botmsg.react("🇾")
    botmsg.react("🇳")
    // Pass message and selectedPlayers, which is an array of selected players for mission
    confirmMissionReader(thisMessage, selectedPlayers);
  })
}

function confirmMissionReader(thisMessage, selectedPlayers){
  
  // Number of players in game
  var numOfPlayers = board.playersCount;
  
  var numOfY = 0;
  var numOfN = 0;

  const filter = (reaction, user) => {
    // Filter everything but Y or N
    // Filter that user that reacted must be currently playing game
    return ['🇾', '🇳'].includes(reaction.emoji.name) && assignedPlayers.get(user);
    // return true;
  };
  
  // Make sure you set dispose to true to collect removed
  const collector = thisMessage.createReactionCollector(filter, { time: 300000, dispose: true });
  
  // Collect for recieving emojis
  collector.on('collect', (reaction, user) => {
    if (reaction.emoji.name === "🇾") {
      numOfY++;
    }
    if (reaction.emoji.name === "🇳") {
      numOfN++;
    }

    if(numOfY > numOfPlayers/2) {
      // Proceed with teams
      collector.stop();
      return playMission(thisMessage, selectedPlayers);
    }
    // If No votes is majority, run back the teams and select
    // A new leader
    // We want this part to end, so it doesn't keep collecting
    if(numOfN >= numOfPlayers/2) {
      collector.stop();
      return createMission(thisMessage, assignedPlayers);
    }
  });

  // Collect for removing remojis
  collector.on('remove', (reaction, user) => {
    if (reaction.emoji.name === "🇾") {
      numOfY--;
    }
    if (reaction.emoji.name === "🇳") {
      numOfN--;
    }
  });
  
  // Collector end must be forced manually later
  collector.on('end', collected => {
    // If users are AFK and not enough votes exist...
    if (!(numOfN >= numOfPlayers/2) && (!(numOfY > numOfPlayers/2))){
      return createMission(thisMessage, assignedPlayers);
    }
  
  });
}

// msg is a placeholder for keeping track what channel we are in
function playMission(msg, selectedPlayers) {
  msg.channel.send('Mission has been accepted, please vote on the mission if you were selected.');
  
  selectedPlayers.forEach((player) => {
    var role = assignedPlayers.get(player).type;
    var isInnocent = true ? role === "innocent" : false;
    player.send(`You have been selected to go on a mission. React with (Y) to accept the mission or React with (N) to fail the mission.
    ${isInnocent ? "You are innocent, so you can only accept the mission." : ""}`)
    .then(botmsg => {
      // Make this new message the current message for round
      thisMessage = botmsg;
      botmsg.react("🇾");
      if (!(isInnocent)) {
        botmsg.react("🇳");
      };
      // Pass message and channel so that the bot can respond appropriately
      playMissionReader(thisMessage, msg);
    })
  });

}

// Play Mission Reader for Helping Play Mission
function playMissionReader(thisMessage, channelMessage){

  const filter = (reaction, user) => {
    // Filter everything but Y or N
    return ['🇾', '🇳'].includes(reaction.emoji.name) && !(user.bot);
  };
  
  // Check if player voted to check for AFK
  var voted = false;

  // Make sure you set dispose to true to collect removed
  // Change AFK timer to be quick
  const collector = thisMessage.createReactionCollector(filter, { time: 300000, dispose: true });
  
  // Collect for recieving emojis
  collector.on('collect', (reaction, user) => {
    // Make sure that innocent players cannot vote Fail
    var role = assignedPlayers.get(user).type;
    if (role === "innocent" && reaction.emoji.name === "🇳") return 1;
    voted = true;
    // Boards is global variable gamestate
    // Set the success or fail in our boardstate
    board.setMissionVotes = reaction.emoji.name;
    collector.stop();
  });

  // Collector end must be forced manually later
  collector.on('end', collected => {
    // If the player did not vote, that means they are AFK
    // If they are AFK, record their vote as success
    if(!(voted)) {
      board.setMissionVotes = "🇾";
    }
    // Logic to complete or fail mission will reside here:
    if(board.getPlayers == board.getNumOfVotes){
      var numOfSuccess = board.getSuccess;
      var numOfFail = board.getFail;
      numOfFail ? board.setMissionStatus = "fail" : board.setMissionStatus = "success";
      // Create dictionary to return our result
      var result = {
        "status": numOfFail ? "failed" : "succeeded",
        "success": numOfSuccess,
        "fail": numOfFail,
      }
      board.incrementRound();
      // Send message and loop the gamestate
      channelMessage.channel.send(`The mission has ${result.status}!
      There were ${result.success} success votes and ${result.fail} fail votes.`);

      // Check if board.status has 3 fails or success
      // If it does, instead of createMission, end the game
      // Or... proceed to end game logic

      // LOGIC FOR ENDING GAME IF TRAITORS WIN 3
      if (board.checkGameOver() === "traitor") return traitorsWin(channelMessage);
      // Check if innocentswin, then run assassin game
      if (board.checkGameOver() === "innocent") return checkAssassin(channelMessage);

      return createMission(channelMessage, assignedPlayers);
    }
    });
}

function traitorsWin(channelMessage) {
  channelMessage.channel.send(`The traitors win! The traitors were ${traitors.join(", ")} and the Merlin was ${merlin}.`);
  return gameOver();
}

// Function to check if the asssassin won by killing merlin
// Or if he failed and innocents win
function didInnocentsWin(merlinGuess, channelMessage) {
  // Assassin has guessed correctly, and traitors win!
  if(merlinGuess.username === merlin) {
    return traitorsWin(channelMessage);
    // Assassin did not guess correctly
  } else {
    channelMessage.channel.send(`The innocents won! The traitors were ${traitors.join(", ")} and the Merlin was ${merlin}.`);
    return gameOver();
  }
}

function checkAssassin(channelMessage){
  var assassin;
  channelMessage.channel.send(`The innocent have won 3 rounds! But the game is not yet over...
  The Assassin has one chance to guess who the Merlin is, if he kills him, the traitors win!`);
  for (let [user, role] of assignedPlayers) {
    if (role.name === "Assassin") {
      assassin = user;
      break;
    }
  };

  assassin.send(`You have one chance to correctly guess and kill the Merlin!
  Who do you want to kill?\n${displayPlayers(assignedPlayers)}`)
  .then(botmsg => {
    const assassinMessage = botmsg;
    for (let index = 1; index <= board.playersCount; index++) {
      botmsg.react(playerEmojis[index]);
    }
    // Pass message to new function for reading reactions
    return checkAssassinReader(assassinMessage, channelMessage)
  })

}

function checkAssassinReader(assassinMessage, channelMessage){
  var relationDict = readReactionsDict(assignedPlayers);
  // Result is players that are selected for mission
  // Must be player objects
  // MerlinGuess will be the guess the assassin picks for merlin
  var merlinGuess;
  const filter = (reaction, user) => {
    // Make sure reactions are in list of reactions
    // Return this to leader when done testing
    // return user.username == leader;
    // Must check if emoji in playerEmojis
    
    return Object.values(playerEmojis).includes(reaction.emoji.name) && !(user.bot);
  };
  
  // Make sure you set dispose to true to collect removed
  const collector = assassinMessage.createReactionCollector(filter, { time: 300000, dispose: true });
  
  // Collect for recieving 
  collector.on('collect', (reaction, user) => {
    // Get type of reaction
    merlinGuess = relationDict[reaction.emoji.name];
    collector.stop();
  });
  
  // Collector end must be forced manually later
  collector.on('end', collected => {
    return didInnocentsWin(merlinGuess, channelMessage);
  });
}



// NEXT TIME

// Other things...:
// Fix !avalonplay so taht it doesn't break the game
// Do not allow a new game to be started while one is in progress
// Allow the players to end the game, somehow
// Perhaps x amount of players need to type !endgame
// If number of players voted > numOfPlayers/2 the game will end prematurely.

// Lastly, fix the front end and UI so it looks pretty
// Perhaps keep a record of the result of each round

// If team is rejected 5 times, the traitors win.
// Add a new counter in Boards.js for this

// HELPER FUNCTION FOR ASSIGNING

function gameOver(){
  traitors = [];
  merlin = "";
  leader;
  assignedUsers = new Array();
  firstLeaderPicked = false;
  leaderIndex = 0;
  board;
  gameInProgress = false;
  savedBotMsg;
  players = new Map();
  assignedPlayers = new Map();
  return 1;
}

// Takes players which is a Map

function assignRoles(players){

  let roleList = createRoleList(players.size);
  roleList = roleList.sort(() => Math.random() - 0.5)
  //Assign players via a loop
  for (let key of players.keys()) {
    // assignedPlayers.set(key, new Roles.Innocent());
    let role = roleList.pop(); 
    assignedPlayers.set(key, role);
  }

}

///////////// HELPER FUNCTION FOR CREATING ROLES
function createRoleList(numOfPlayers){
  var roleList = [];
  var evilPushed = 0;
  roleList.push(new Roles.Merlin());
  roleList.push(new Roles.Assassin());
  // Create exception for 9 players
  if (numOfPlayers === 9) {
    var resultEvil = 2;
    for (let i = 0; i < numOfPlayers - 2; i++) {
      if(evilPushed >= resultEvil) {
        roleList.push(new Roles.Innocent());
      } else {
        evilPushed ++;
        roleList.push(new Roles.Traitor());
      }
    }
    return roleList;
  }
  // Num of players minus from default roles
  numOfPlayers = numOfPlayers - 2;
  var divideBy = 2;
  
  var evil = Math.floor(numOfPlayers/divideBy);
  var remainder = numOfPlayers % divideBy;
  
  var resultEvil = remainder ? evil : evil - 1;
  // var resultGood = numOfPlayers - resultEvil;

  for (let i = 0; i < numOfPlayers; i++) {
    if(evilPushed >= resultEvil) {
      roleList.push(new Roles.Innocent());
    } else {
      evilPushed ++;
      roleList.push(new Roles.Traitor());
    }
  }
  return roleList;
  
}

// Displaying number of players in text
// Helper function for createMission
function displayPlayers(assignedPlayers){
  // Result returns a string of all players and their number
  var result = "";
  // Create our own index because JS does not provide
  var index = 1;
  // Loop through Map datastructure
  // This could be done via casting Map as Array and looping normally
  for (let player of assignedPlayers.keys()){
    result += `${index}: ${player.username}\n`;
    index++;
  }
  return result;
}



module.exports = {
  startGame,
  play,
}



// SAVED FUNCTIONS FOR LATER
// const filter = (reaction, user) => {
//   return reaction.emoji.name === '👍' || reaction.emoji.name === '👎';
// };

// const collector = msg.createReactionCollector(filter, { time: 10000 });

// collector.on('collect', (reaction, user) => {
//   console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
// });

// collector.on('end', collected => {

//   collected.map(s => console.log(`Collected ${s.count}`));

// });
// });