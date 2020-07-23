let twitchMessageCallbacks = {};
let twitchChat = null;
let twitchAPI = null;
let lastChatMessage = { c: null, m: null };

const SHOW_LOW_LEVEL_MESSAGES = false;
const SHOW_UNHANDLED_MESSAGES = true;


class TwitchController {
    constructor() {}

    static async Connect(twitchChannel, twitchBotUsername, twitchToken) {
        channel = twitchChannel.toLowerCase();
        username = twitchBotUsername;
        token = twitchToken;

        console.log(channel, username, token);

        // Instantiate the TwitchJS objects
        const { chat, api } = new TwitchJs({ token, username });
        twitchChat = chat;
        twitchAPI = api;

        twitchChat.onAction = (channel, user, message, msg) => { console.log("Action", channel, user, message, msg); }
        twitchChat.onAuthenticationFailure = (message) => { console.log("Authentication Failure", message); }

        // Listen for all events.
        chat.on(TwitchJs.Chat.Events.ALL, this.handleTwitchMessage);
        
        // Connect ...
        let connectResult = await chat.connect();
        if (!connectResult) { return false; }

        TwitchController.AddMessageCallback("MSG_RATELIMIT", () => {
            //  try to resend the same message again
            setTimeout(() => { TwitchController.SendChatMessage(lastChatMessage.c, lastChatMessage.m); }, 500);
            return true;
        });

        chat.join(channel);
        //TwitchController.SendChatMessage(channel, "System is connected and ready to begin!");
        return true;
    }

    static async SendChatMessage(sendChannel, sendMessage) {
        if (!sendChannel || !sendMessage) { return; }
        lastChatMessage = { c: sendChannel, m: sendMessage };
        twitchChat.say(sendChannel, sendMessage);
    }

    static AddMessageCallback(eventID, callback) { twitchMessageCallbacks[eventID] = callback; }
    
    static handleTwitchMessage(message) {
        if (twitchMessageCallbacks.hasOwnProperty(message.event)) { if (twitchMessageCallbacks[message.event](message)) return; }

        switch (message.event) {
            case "PING":                        if (message.channel === "tmi.twitch.tv") TwitchController.SendChatMessage("tmi.twitch.tv", "PONG");                 break;
            case "PONG":
            case "CAP":                 
            case "001":
            case "002":
            case "003":
            case "004":
            case "375":
            case "372":
            case "376":
            case "353":
            case "366":                         if (SHOW_LOW_LEVEL_MESSAGES) console.log(message.event + " EVENT: " + message.message);                             break;
            case "JOIN":                        if (SHOW_LOW_LEVEL_MESSAGES) console.log("JOIN EVENT: " + message.username);                                        break;
            case "PRIVMSG":                     if (SHOW_LOW_LEVEL_MESSAGES) console.log("CHAT MESSAGE - " + message.username + ": " + message.message);            break;
            case "GLOBALUSERSTATE":     
            case "USERSTATE":
            case "ROOMSTATE":                   if (SHOW_LOW_LEVEL_MESSAGES) console.log(message.event + " event occurred");                                        break;
            case "HOSTTARGET":                  if (SHOW_LOW_LEVEL_MESSAGES) console.log("Host Target: " + message.username);                                       break;
            case "HOST_ON":                     if (SHOW_LOW_LEVEL_MESSAGES) console.log("HOST ON: " + message.message + " on " + message.username);                break;
            case "HOST_OFF":                    if (SHOW_LOW_LEVEL_MESSAGES) console.log("HOST OFF: " + message.message + " on " + message.username);               break;
            case "HOST_TARGET_WENT_OFFLINE":    if (SHOW_LOW_LEVEL_MESSAGES) console.log("HOST TARGET OFFLINE: " + message.message + " on " + message.username);    break;
            default:                            if (SHOW_UNHANDLED_MESSAGES) console.log(message);                                                                                               break;
        }
    };

    static onAuthenticationFailure(message) {
        console.log("Authentication Failure", message);
    }
}