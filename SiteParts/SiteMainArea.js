class SiteMainArea {
    constructor(options) {
        this.options = options;
        this.autoOptions = { autoRaid: true, autoDungeon: true };
        this.elements = { botControlScreen: null, twitchChatContainer: null, };
        this.content = this.generateContent();
    }

    generateContent() {
        //  Create the main container and the centered header box
        let container = new Container({ id: "SiteMainArea", style: {}, });
        let centeredMainArea = new Container({ id: "CenteredMainArea", style: { margin: "auto", width: "920px", height: "100%", overflow: "hidden", }, });
        container.appendChild(centeredMainArea.content);

        this.elements.botControlScreen = new BotControlScreen({});
        this.elements.botControlScreen.setChangeOptionsCallback((options) => { Object.assign(this.autoOptions, options); });
        this.elements.botControlScreen.setHidden(true);
        centeredMainArea.appendChild(this.elements.botControlScreen.content);

        //  Create the twitch chat stream early so we can pass it into other classes
        this.elements.twitchChatContainer = new TwitchChatScreen({});

        this.elements.twitchChatContainer = new TwitchChatScreen({});
        this.elements.twitchChatContainer.setHidden(true);
        centeredMainArea.appendChild(this.elements.twitchChatContainer.content);

        this.setTwitchChatCallbacks();

        return container.content;
    }

    setTwitchChatCallbacks() {
        TwitchController.AddMessageCallback("PRIVMSG", (message) => {
            let messageLower = message.message.toLowerCase();

            if (message.username === username.toLowerCase()) {

                //  Auto-reply on raids
                if (this.autoOptions.autoRaid && messageLower.includes("help fight him by typing !raid")) {
                    TwitchController.SendChatMessage(channel, "!raid");
                    return true;
                }

                //  Auto-reply on dungeons
                if (this.autoOptions.autoDungeon && messageLower.includes("type !dungeon to join.")) {
                    TwitchController.SendChatMessage(channel, "!dungeon");
                    return true;
                }

                //  Auto re-join if we aren't connected (also try to re-fire our last message before)
                let raidUnjoined =  (messageLower === (myUsername.toLowerCase() + ", you have to !join the game before using this command."));
                let dungeonUnjoined =  (messageLower === (myUsername.toLowerCase() + ", you are not currently playing, use the !join to start playing."));
                if (raidUnjoined || dungeonUnjoined) {
                    let lastCommand = {};
                    Object.assign(lastCommand, lastChatMessage);
                    TwitchController.SendChatMessage(channel, "!join");
                    TwitchController.SendChatMessage(channel, "!train all");
                    if (lastCommand.m) { TwitchController.SendChatMessage(lastCommand.c, lastCommand.m); }
                    return true;
                }
            }
            else if (message.username === channel.toLowerCase()) {
                //  Auto-join when told to
                if (messageLower.includes("autobots, roll out")) {
                    TwitchController.SendChatMessage(channel, "!join");
                    return true;
                }
            }

            //  Add a new entry to our on-screen chat
            if (this.elements.twitchChatContainer.content.children.length >= 20) {
                this.elements.twitchChatContainer.content.removeChild(this.elements.twitchChatContainer.content.children[0]);
            }
            this.elements.twitchChatContainer.createChatLine(message.username, message.message);
            return true;
        });
    }

    ShowChooseCampaignUI(show) {
        this.elements.botControlScreen.setHidden(!show);
        this.elements.twitchChatContainer.content.style.display = show ? "block" : "none";
    }
}