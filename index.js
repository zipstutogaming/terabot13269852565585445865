const config = require('./config.json');
const Discord = require('discord.js');
const util = require('util');
const {get} = require("snekfetch"); 
const bot = new Discord.Client({
    disableEveryone: true,
    disabledEvents: ['TYPING_START']
});

bot.on("ready", () => {
    bot.user.setGame('TeraCube | ?help'); //you can set a default game
    console.log(`Bot en ligne!\n${bot.users.size} utilisateurs, dans ${bot.guilds.size} serveurs connectés.`);
});

bot.on("guildCreate", guild => {
    console.log(`I've joined the guild ${guild.name} (${guild.id}), owned by ${guild.owner.user.username} (${guild.owner.user.id}).`);
});

bot.on("message", (message) => { 

    if(message.author.bot || message.system) return; // Ignore bots
    
    if(message.channel.type === 'dm') { // Direct Message
        return; //Optionally handle direct messages
    }

    console.log(message.content); // Log chat to console for debugging/testing
    
    if (message.content.indexOf(config.prefix) === 0) { // Message starts with your prefix
        
        let msg = message.content.slice(config.prefix.length); // slice of the prefix on the message

        let args = msg.split(" "); // break the message into part by spaces

        let cmd = args[0].toLowerCase(); // set the first word as the command in lowercase just in case

        args.shift(); // delete the first word from the args


         if (cmd === 'ping') { // ping > pong just in case..
            return message.channel.send('pong');
        }

         if (cmd === 'help') { 
            return message.channel.send({
  "content": "Voici la liste des commandes:",
  "embed": {
    "title": "Liste des commandes",
    "url": "",
    "color": 8311585,
    "footer": {
      "icon_url": "https://media.discordapp.net/attachments/364815314791301124/424905803061919744/dce67987553e26bb41604e54c8f92b92.png",
      "text": "TeraBot | v1.0.2"
    },
    "thumbnail": {
      "url": ""
    },
    "image": {
      "url": ""
    },
    "author": {
      "name": "",
      "url": "",
      "icon_url": ""
    },
    "fields": [
      {
        "name": "?help",
        "value": "Affiche la liste des commandes"
      },
      {
        "name": "?ip",
        "value": "Affiche l'ip du serveur"
      },
       {
        "name": "?info",
        "value": "Affiche les informations du bot"
      },
      {
        "name": "?ping",
        "value": "Pong"
      }
    ]
  }
});
        }

        else if (cmd === "say") {
            message.channel.send(args.join(" "))
        }

        else if (cmd === "ip") {
            message.channel.send("IP: `teracube.mcpe.eu` \nPort: `19144`")
        }

        else if (cmd === 'info') { 
                return message.channel.send({
  "content": "Voici les informations du bot:",
  "embed": {
    "title": "Informations sur le bot",
    "url": "",
    "color": 8311585,
    "footer": {
      "icon_url": "https://media.discordapp.net/attachments/364815314791301124/424905803061919744/dce67987553e26bb41604e54c8f92b92.png",
      "text": "TeraBot | v1.0.2"
    },
    "thumbnail": {
      "url": ""
    },
    "image": {
      "url": ""
    },
    "author": {
      "name": "",
      "url": "",
      "icon_url": ""
    },
    "fields": [
      {
        "name": "Nom du bot:",
        "value": "TeraBot"
      },
      {
        "name": "Créateur:",
        "value": "Zips Tuto/Gaming#8306"
      },
      {
        "name": "Version du bot:",
        "value": "1.0.2"
      },
      {
        "name": "Date de mise à jour:",
        "value": "21/03/2018"
      }
    ]
  }
});     
        }

        // Make sure this command always checks for you. YOU NEVER WANT ANYONE ELSE TO USE THIS COMMAND
        else if (cmd === "eval" && message.author.id === config.owner){ // < checks the message author's id to yours in config.json.
            const code = args.join(" ");
            return evalCmd(message, code);
        }
        
       else if (cmd === "ann") {
	   if (message.member.hasPermission("ADMINISTRATOR")) {
		   const text = args.join(" ")
		   if (text.length < 1) return message.channel.send(":x: Ce message est vide.");
		   //const colour = args.slice(2).join("");
		   const embed = new Discord.RichEmbed()
		   .setColor(0x954D23)
		   .setTitle("Annonce:")
		   .setDescription(text);
		   message.channel.send("@everyone", {embed})
	   }
   }
   
   if (cmd == 'chat') {
		try {
			get('https://aws.random.cat/meow').then(response => {
				message.channel.send({files: [{attachment: response.body.file, name: `cat.${response.body.file.split('.')[2]}`}]});
			});
		} catch (e) {
			return message.channel.send(e.stack);
		}
	};


      /*  else { // if the command doesn't match anything you can say something or just ignore it
            message.channel.send(`Commande inconnue.`);
            return;
        } */
        
    } else if (message.content.indexOf("<@"+bot.user.id) === 0 || message.content.indexOf("<@!"+bot.user.id) === 0) { // Catch @Mentions

        return message.channel.send(`Utilise \`${config.prefix}\` pour intéragir avec moi.`); //help people learn your prefix
    }
    return;
});

function evalCmd(message, code) {
    if(message.author.id !== config.owner) return;
    try {
        let evaled = eval(code);
        if (typeof evaled !== "string")
            evaled = util.inspect(evaled);
            message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}
function clean(text) {
    if (typeof(text) !== 'string') {
        text = util.inspect(text, { depth: 0 });
    }
    text = text
        .replace(/`/g, '`' + String.fromCharCode(8203))
        .replace(/@/g, '@' + String.fromCharCode(8203))
        .replace(config.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0') //Don't let it post your token
    return text;
}

// Catch Errors before they crash the app.
process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error('Uncaught Exception: ', errorMsg);
    // process.exit(1); //Eh, should be fine, but maybe handle this?
});

process.on('unhandledRejection', err => {
    console.error('Uncaught Promise Error: ', err);
    // process.exit(1); //Eh, should be fine, but maybe handle this?
});

bot.login(config.token);
    
