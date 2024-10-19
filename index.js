import {
    Client,
    Events,
    GatewayIntentBits,
    ChannelType,
    REST,
    Routes
} from "discord.js";
import 'dotenv/config';

/**
 * Create a new Discord Client instance
 */
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

/**
 * Emitted when the client is ready
 * @event Client#ready
 */
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

/**
 * Emitted when an interaction is created
 * @event Client#interaction
 */
client.on(Events.InteractionCreate, async interaction => {
    console.log("interaction", interaction.options);
    interaction.reply("test good");
});

/**
 * Emitted when a message is created
 */
client.on(Events.MessageCreate, async msg => {
    console.log("message", msg.channelId);
    if (msg.author.id !== process.env.CLIENT_ID
        && msg.channelId === process.env.CHANNEL_ID) {

        console.log("MESSAGE CONTENTS -->", msg.content);
        console.log("MESSAGE CONTENTS -->", msg.attachments);

        if (msg.content === "ping"
            && msg.thread === null
            && msg.channel.type !== ChannelType.PublicThread) {

            let thread = await msg.startThread({
                "name": "My thread",
            });
            thread.send("Hello");
        }

        else if (msg.content === "ping"
            && msg.channel.type === ChannelType.PublicThread) {

            console.log("THREAD CONTENTS -->", msg.channel.name);
            msg.channel.send("We are in a thread now");
        }
    }
});

client.login(process.env.TOKEN);

/**
 * Register a slash command on the server
 */
const commands = [
    {
        name: "ping",
        description: "Replies with Pong!"
    }
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.SERVER_ID),
            { body: commands }
        );
        console.log("Successfully registered application commands.");
    } catch (error) {
        console.error(error);
    }
})();
