//  Working with twitchJS 2.0.0-beta.33

let twitchMessageCallbacks = {};
let twitchChat = null;
let twitchAPI = null;
let lastChatMessage = { c: null, m: null };

const SHOW_LOW_LEVEL_MESSAGES = false;
const SHOW_WHISPERS = true;
const SHOW_SUPPORT_MESSAGES = true;
const SHOW_PROBLEM_MESSAGES = true;
const SHOW_UNHANDLED_MESSAGES = true;


class TwitchController {
    constructor() {}

    static async Connect(twitchChannel, twitchBotUsername, twitchToken) {
        channel = twitchChannel.toLowerCase();
        username = twitchBotUsername;
        token = twitchToken;

        // Instantiate the TwitchJS objects
        const { chat, api } = new TwitchJs({ token, username });
        twitchChat = chat;
        twitchAPI = api;

        twitchChat.onAction = (channel, user, message, msg) => { console.log("Action", channel, user, message, msg); }
        twitchChat.onAuthenticationFailure = (message) => { console.log("Authentication Failure", message); }

        // Listen for all events.
        chat.on(TwitchJs.Chat.Events.ALL, this.handleTwitchMessage);
        
        // Connect and save off our personal username
        let connectResult = await chat.connect();
        if (!connectResult) { return false; }
        if (!twitchChat._userState) { return false; }
        myUsername = twitchChat._userState.username;

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
            case "366":                             if (SHOW_LOW_LEVEL_MESSAGES) console.log(message.event + " EVENT: " + message.message);                             break;
            case "JOIN":                            if (SHOW_LOW_LEVEL_MESSAGES) console.log("JOIN EVENT: " + message.username);                                        break;
            case "PART":                            if (SHOW_LOW_LEVEL_MESSAGES) console.log("PART EVENT: " + message.username);                                        break;
            case "PRIVMSG":                         if (SHOW_LOW_LEVEL_MESSAGES) console.log("CHAT MESSAGE - " + message.username + ": " + message.message);            break;
            case "GLOBALUSERSTATE":                 if (SHOW_LOW_LEVEL_MESSAGES) console.log("GLOBALUSERSTATE" + " event occurred");                                    break;
            case "USERSTATE":                       if (SHOW_LOW_LEVEL_MESSAGES) console.log("USERSTATE" + " event occurred");                                          break;
            case "ROOMSTATE":                       if (SHOW_LOW_LEVEL_MESSAGES) console.log("ROOMSTATE" + " event occurred");                                          break;
            case "HOSTTARGET":                      if (SHOW_LOW_LEVEL_MESSAGES) console.log("Host Target: " + message.username);                                       break;
            case "HOST_ON":                         if (SHOW_LOW_LEVEL_MESSAGES) console.log("HOST ON: " + message.message + " on " + message.username);                break;
            case "HOST_OFF":                        if (SHOW_LOW_LEVEL_MESSAGES) console.log("HOST OFF: " + message.message + " on " + message.username);               break;
            case "HOSTED/WITHOUT_VIEWERS":          if (SHOW_LOW_LEVEL_MESSAGES) console.log("HOST (NO VIEWERS): " + message.username);                                 break;
            case "HOST_TARGET_WENT_OFFLINE":        if (SHOW_LOW_LEVEL_MESSAGES) console.log("HOST TARGET OFFLINE: " + message.message + " on " + message.username);    break;
            case "USER_BANNED":                     if (SHOW_LOW_LEVEL_MESSAGES) console.log("USER BANNED: " + message.username);                                       break;
            case "MSG_DUPLICATE":                   if (SHOW_LOW_LEVEL_MESSAGES) console.log("MESSAGE DUPLICATE");                                                      break;

            case "WHISPER":                         if (SHOW_WHISPERS) console.log("WHISPER from " + message.username + ": " + message.message);                        break;

            case "CHEER":                           if (SHOW_SUPPORT_MESSAGES) console.log("CHEER: " + message.tags.bits.toString() + " bits from " + message.username); break;
            case "SUBSCRIPTION_GIFT_COMMUNITY":     if (SHOW_SUPPORT_MESSAGES) console.log("SUBSCRIPTION_GIFT_COMMUNITY: " + message.username + "(" + message.parameters.massGiftCount + "/" + message.parameters.senderCount + ")");       break;
            case "REWARDGIFT":                      if (SHOW_SUPPORT_MESSAGES) console.log("CHEER REWARD: " + message.username + "(" + message.parameters.totalRewardCount + ")");      break;
            case "SUBSCRIPTION_GIFT":               if (SHOW_SUPPORT_MESSAGES) console.log("GIFTED SUBSCRIPTION: " + message.username + " => " + message.parameters.recipientDisplayName + " (" + message.parameters.giftMonths + ")");     break;
            case "RAID":                            if (SHOW_SUPPORT_MESSAGES) console.log("RAID: " + message.username + " (" + message.parameters.viewerCount);        break;
            case "RESUBSCRIPTION":                  if (SHOW_SUPPORT_MESSAGES) console.log("RESUBSCRIPTION: " + message.username + "(" + message.parameters.cumulativeMonths + " total)");  break;

            case "DISCONNECTED":                    if (SHOW_PROBLEM_MESSAGES) console.log("DISCONNECTED");                                                             break;
            case "ERROR_ENCOUNTERED":               if (SHOW_PROBLEM_MESSAGES) console.log("ERROR ENCOUNTERED");                                                        break;

            default:                                if (SHOW_UNHANDLED_MESSAGES) console.log("UNHANDLED:", message);                                                    break;
        }
    };

    static onAuthenticationFailure(message) {
        console.log("Authentication Failure", message);
    }
}