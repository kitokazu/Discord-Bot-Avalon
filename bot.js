// require the discord.js module
const Discord = require('discord.js');

// create a new Discord client
const client = new Discord.Client();

// load auth.json token
const auth = require('./tokens/auth.json');

//Messages must begin with this variable
const prefix = '!';

// Import avalon game
const Avalon = require('./commands/Avalon.js');

// Import dev game
const AvalonDev = require('./commands/AvalonDev.js');

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});


// login to Discord with your app's token
client.login(auth.token);
// Setup for checking if bot is online ENDS

client.on('message', msg => {
  // if message doesn't start with ! return nothing
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const args = msg.content.slice(prefix.length).split(/\s+/);
  const command = args.shift().toLowerCase();
  if (command === 'avalon') {
    Avalon.startGame(msg);
  }
  if (command === 'avalonplay') {
    Avalon.play(msg);
  }
  if (command === 'avalondev') {
    AvalonDev.testLoop(msg);
  }
  if (command === 'avalondevplay') {
    AvalonDev.testLoop(msg);
  }
  
});