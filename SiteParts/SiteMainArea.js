class SiteMainArea {
    constructor(options) {
        this.options = options;
        this.autoOptions = { autoRaid: true, autoDungeon: true, helpBot: false, raidTrigger: false };
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

            let messageFlags = {
                relevantToMe:       (messageLower.includes(myUsername.toLowerCase()) ||  (message.username === myUsername.toLowerCase())),
                sentFromRavenbot:   (message.username === username.toLowerCase()),
                sentFromStreamer:   (message.username === channel.toLowerCase()),
                streamElements:     (message.username === "streamelements"),
                nightbot:           (message.username === "nightbot"),

                vendorSale:         (messageLower.includes("you sold ") &&  messageLower.includes("to the vendor for")),
                raidJoinedMsg:      (messageLower.includes("you have joined the raid. good luck!")),
                dungeonJoinedMsg:   (messageLower.includes("you have joined the dungeon. good luck!")),
                disembarkedFerry:   (messageLower.includes(", you have disembarked the ferry.")),
                raidTryOnFerry:     (messageLower.includes("you cannot join the raid while on the ferry.")),
                youHaveToJoin:      (messageLower.includes("you have to !join the game before using this command.")),
                dungeonUnjoined:    (messageLower.includes(", you are not currently playing. use !join to start playing!")),
                dungeonTimer:       (messageLower.includes(" until dungeon starts.")),
                youNeedToCraft:     (messageLower.includes(", you need") && messageLower.includes(" to craft ")),
                alreadyJoined:      (messageLower.includes("join failed. reason: you're already playing!")),
                playerGotItem:      (messageLower.includes("you found a ")),
                ravenbotStats:      (messageLower.includes(", combat level ") && messageLower.includes(", attack ") && messageLower.includes(", farming ") && messageLower.includes(", -- total ")),
                islandCheck:        (messageLower.includes("you're on the island called")),
                welcomeMessage:     (messageLower.includes(", welcome to the game!")),
                cannotUseShow:      (messageLower.includes("you do not have permission to set the currently observed player.")),
                foundAndEquipped:   (messageLower.includes(", you found and equipped")),
                singleStatReport:   (messageLower.includes(", ") && messageLower.includes(" (") && messageLower.includes("%)")),
                resourcesReport:    (messageLower.includes(", wood ") && messageLower.includes(", ore ") && messageLower.includes(", fish ") && messageLower.includes(", wheat ") && messageLower.includes(", coin ")),
                activePetChange:    (messageLower.includes(", you have changed your active pet to ")),

                playerJoining:      (messageLower.includes("!join")),
                playerLeaving:      (messageLower.includes("!leave")),
                playerTraining:     (messageLower.includes("!train ")),
                playerCrafting:     (messageLower.includes("!craft ")),
                playerRaid:         (messageLower.includes("!raid")),
                playerDungeon:      (messageLower.includes("!dungeon")),
                playerStats:        (messageLower.includes("!stats")),
                playerResource:     (messageLower.includes("!res")),
                playerToggle:       (messageLower.includes("!toggle")),
                playerUseMarket:    (messageLower.includes("!buy") || messageLower.includes("!sell") || messageLower.includes("!vendor")),

                isNowLiveMessage:   (messageLower.includes("is now live! streaming ")),

                nbSpamWarning:      (messageLower.includes("[blacklisted spam] [warning]")),
            };

            if (messageFlags.sentFromRavenbot) {
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
                let raidUnjoined = (messageLower === (myUsername.toLowerCase() + ", you have to !join the game before using this command."));
                let dungeonUnjoined = (messageLower === (myUsername.toLowerCase() + ", you are not currently playing, use the !join to start playing."));
                if (messageFlags.relevantToMe && (raidUnjoined || dungeonUnjoined)) {
                    let lastCommand = {};
                    Object.assign(lastCommand, lastChatMessage);
                    TwitchController.SendChatMessage(channel, "!join");
                    TwitchController.SendChatMessage(channel, "!train all");
                    if (lastCommand.m) { TwitchController.SendChatMessage(lastCommand.c, lastCommand.m); }
                    return true;
                }
            }
            else if (messageFlags.sentFromStreamer) {
                //  Auto-join when told to
                if (messageLower.includes("autobots, roll out")) {
                    TwitchController.SendChatMessage(channel, "!join");
                    setTimeout(() => { TwitchController.SendChatMessage(channel, "!train all"); }, 400);
                    return true;
                }

                //  Join raid when told to
                if (messageLower.includes("autobots, raid time")) {
                    TwitchController.SendChatMessage(channel, "!raid");
                    return true;
                }

                //  Join dungeon when told to
                if (messageLower.includes("autobots, dungeon time")) {
                    TwitchController.SendChatMessage(channel, "!dungeon");
                    return true;
                }
            }

            //  Filter out certain chat messages that get this far and are not relevant to me
            if (!messageFlags.relevantToMe)
            {
                if (messageFlags.sentFromRavenbot) {
                    if (messageFlags.vendorSale) { return true; }
                    if (messageFlags.raidJoinedMsg) { return true; }
                    if (messageFlags.dungeonJoinedMsg) { return true; }
                    if (messageFlags.disembarkedFerry) { return true; }
                    if (messageFlags.raidTryOnFerry) { return true; }
                    if (messageFlags.youHaveToJoin) { return true; }
                    if (messageFlags.dungeonUnjoined) { return true; }
                    if (messageFlags.youNeedToCraft) { return true; }
                    if (messageFlags.alreadyJoined) { return true; }
                    if (messageFlags.playerGotItem) { return true; }
                    if (messageFlags.ravenbotStats) { return true; }
                    if (messageFlags.islandCheck) { return true; }
                    if (messageFlags.welcomeMessage) { return true; }
                    if (messageFlags.cannotUseShow) { return true; }
                    if (messageFlags.dungeonTimer) { return true; }
                    if (messageFlags.foundAndEquipped) { return true; }
                    if (messageFlags.singleStatReport) { return true; }
                    if (messageFlags.resourcesReport) { return true; }
                    if (messageFlags.activePetChange) { return true; }
                }
                else if (!messageFlags.sentFromStreamer) {
                    if (messageFlags.playerJoining) { return true; }
                    if (messageFlags.playerLeaving) { return true; }
                    if (messageFlags.playerTraining) { return true; }
                    if (messageFlags.playerCrafting) { return true; }
                    if (messageFlags.playerRaid) { return true; }
                    if (messageFlags.playerDungeon) { return true; }
                    if (messageFlags.playerStats) { return true; }
                    if (messageFlags.playerResource) { return true; }
                    if (messageFlags.playerToggle) { return true; }
                    if (messageFlags.playerUseMarket) { return true; }

                    if (messageFlags.isNowLiveMessage && messageFlags.streamElements) { return true; }
                    if (messageFlags.nbSpamWarning && messageFlags.nightbot) { return true; }
                }
            }

            //  Add a new entry to our on-screen chat
            this.elements.twitchChatContainer.addChatLine(message.username, message.message, messageFlags.relevantToMe);
            return true;
        });
    }

    ShowMainAreaUI(show) {
        this.elements.botControlScreen.setHidden(!show);
        this.elements.botControlScreen.update();
        this.elements.twitchChatContainer.content.style.display = show ? "block" : "none";
    }
}