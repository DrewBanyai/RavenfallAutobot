class SiteMainArea {
    constructor(options) {
        this.options = options;
        this.autoRaidTriggerMinutes = 10;
        this.lastRaidOccurred = 0;
        this.autoOptions = { autoRaid: true, autoDungeon: true, concealBot: false, autoTrain: false, autoTrainSkill: "all", helpBot: false, autoRaidTrigger: false, allowRaidTrigger: false };
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
        this.elements.twitchChatContainer.setHidden(true);
        centeredMainArea.appendChild(this.elements.twitchChatContainer.content);

        this.setTwitchChatCallbacks();

        setInterval(() => {
            if (!this.autoOptions.autoRaidTrigger) { return; }
            let secondsSinceLastRaid = (((new Date()).getTime() - this.lastRaidOccurred) / 1000);
            if (secondsSinceLastRaid >= (this.autoRaidTriggerMinutes * 60 - 10)) { this.triggerRaid(null); }
        }, this.autoRaidTriggerMinutes * 60 * 1000)

        return container.content;
    }

    setTwitchChatCallbacks() {
        TwitchController.AddTwitchMessageCallback("PRIVMSG", (message) => {
            let messageLower = message.message.toLowerCase();
            let iAmStreamer = (myUsername.toLowerCase() === channel.toLowerCase());

            let messageFlags = {
                relevantToMe:       (messageLower.includes(myUsername.toLowerCase()) ||  (message.username === myUsername.toLowerCase())),
                sentFromRavenbot:   (message.username === username.toLowerCase()),
                sentFromStreamer:   (message.username === channel.toLowerCase()),
                streamElements:     (message.username === "streamelements"),
                nightbot:           (message.username === "nightbot"),
                raidStarted:        (messageLower.includes("help fight him by typing !raid")),
                dungeonStarted:     (messageLower.includes("type !dungeon to join.")),
                vendorSale:         (messageLower.includes("you sold ") &&  messageLower.includes("to the vendor for")),
                raidJoinedMsg:      (messageLower.includes("you have joined the raid. good luck!")),
                dungeonJoinedMsg:   (messageLower.includes("you have joined the dungeon. good luck!")),
                disembarkedFerry:   (messageLower.includes(", you have disembarked the ferry.")),
                raidTryOnFerry:     (messageLower.includes("you cannot join the raid while on the ferry.")),
                youHaveToJoin:      (messageLower.includes("you have to !join the game before using this command.")),
                dungeonUnjoined:    (messageLower.includes("you are not currently playing") && messageLower.includes("!join to start playing.")),
                trainingUnjoined:   (messageLower.includes("you're not in game. use !join to start playing")),
                noActiveDungeons:   (messageLower.includes(", no active dungeons available, sorry.")),
                dungeonTimer:       (messageLower.includes(" until dungeon starts.")),
                youNeedToCraft:     (messageLower.includes(", you need") && messageLower.includes(" to craft ")),
                alreadyJoined:      (messageLower.includes("join failed. reason: you're already playing!")),
                alreadyInRaid:      (messageLower.includes(", you have already joined the raid")),
                alreadyInDungeon:   (messageLower.includes("you have already joined the dungeon.")),
                cannotStartRaid:    (messageLower === "raid cannot be started right now."),
                playerGotItem:      (messageLower.includes("you found a ")),
                ravenbotStats:      (messageLower.includes(", combat level ") && messageLower.includes(", attack ") && messageLower.includes(", farming ") && messageLower.includes(", -- total ")),
                islandCheck:        (messageLower.includes("you're on the island called")),
                welcomeMessage:     (messageLower.includes(", welcome to the game!")),
                cannotUseShow:      (messageLower.includes("you do not have permission to set the currently observed player.")),
                foundAndEquipped:   (messageLower.includes(", you found and equipped")),
                singleStatReport:   (messageLower.includes(", ") && messageLower.includes(" (") && messageLower.includes("%)")),
                resourcesReport:    (messageLower.includes(", wood ") && messageLower.includes(", ore ") && messageLower.includes(", fish ") && messageLower.includes(", wheat ") && messageLower.includes(", coin ")),
                activePetChange:    (messageLower.includes(", you have changed your active pet to ")),
                specifyCrafting:    (messageLower.includes("you must specify an item or category to craft. Currently supported item categories")),
                youCraftedA:        (messageLower.includes(", you crafted a")),
                cannotBeToggled:    (messageLower.includes("cannot be toggled.")),
                beAtCraftingTable:  (messageLower.includes(", you can't currently craft weapons or armor. you have to be at the crafting table")),
                selectWhatToCraft:  (messageLower.includes("you must specify an item or category to craft. currently supported item categories")),
                noItemInMarket:     (messageLower.includes(", could not find any") && messageLower.includes(" in the marketplace.")),
                islandLevelGlitch:  (messageLower.includes(", you need to be at least combat level 75 to train this skill on this island.")),
                itemOnMarket:       (messageLower.includes("was put in the marketplace listing for")),
                currentTraining:    (messageLower.includes(", you're currently training")),
                notTraining:        (messageLower.includes(", you're not training anything. use")),
                cantCraftYet:       (messageLower.includes("you can't craft this item") && messageLower.includes("requires level")),
                youGifted:          (messageLower.includes("you gifted ") && messageLower.includes(" to ")),
                currentMultiplier:  (messageLower.includes("the current exp multiplier")),

                playerJoining:      (messageLower === "!join"),
                playerLeaving:      (messageLower === "!leave"),
                playerCrafting:     (messageLower.includes("!craft ")),
                playerRaid:         (messageLower === "!raid"),
                raidPlayer:         (messageLower.includes("!raid ")),
                playerDungeon:      (messageLower === "!dungeon"),
                playerStats:        (messageLower.substr(0, 6) === "!stats"),
                playerTraining:     (messageLower.substr(0, 6) === "!train"),
                playerResource:     (messageLower === "!res"),
                playerToggle:       (messageLower.includes("!toggle")),
                playerUseMarket:    (messageLower.includes("!buy") || messageLower.includes("!sell") || messageLower.includes("!vendor")),
                playerSeekingHelp:  (messageLower.substr(0, 5) === "!help"),
                playerRaidTrigger:  (messageLower === "!raidstart"),
                playerCheckIsland:  (messageLower === "!island"),

                isNowLiveMessage:   (messageLower.includes("is now live! streaming ")),
                noItemFoundSE:      (messageLower.includes(", item not found, you can see all items here")),

                nbSpamWarning:      (messageLower.includes("[blacklisted spam] [warning]")),
            };

            //  Remove all false flags
            let flagKeys = Object.keys(messageFlags);
            flagKeys.forEach((flagType) => {
                if (["relevantToMe", "sentFromStreamer"].includes(flagType)) { return; }
                if (!messageFlags[flagType]) { delete messageFlags[flagType]; }
            });

            if (messageFlags.sentFromRavenbot) {
                //  Auto-reply on raids
                if (messageFlags.raidStarted) {
                    this.lastRaidOccurred = (new Date()).getTime();
                    if (this.autoOptions.autoRaid) {
                        let replyDelay = this.autoOptions.concealBot ? (4000 + (Math.random() * 6000)) : 1;
                        setTimeout(() => { TwitchController.SendChatMessage(channel, "!raid"); }, replyDelay);
                        return true;
                    }
                }

                //  Auto-reply on dungeons
                if (this.autoOptions.autoDungeon && messageFlags.dungeonStarted) {
                    let replyDelay = this.autoOptions.concealBot ? (4000 + (Math.random() * 6000)) : 1;
                    setTimeout(() => { TwitchController.SendChatMessage(channel, "!dungeon"); }, replyDelay);
                    return true;
                }

                //  Auto re-join if we aren't connected (also try to re-fire our last message before)
                if (messageFlags.relevantToMe && (messageFlags.youHaveToJoin || messageFlags.dungeonUnjoined)) {
                    let lastCommand = {};
                    Object.assign(lastCommand, lastChatMessage);
                    TwitchController.SendChatMessage(channel, "!join");
                    
                    if (this.autoOptions.autoTrain) { setTimeout(() => { TwitchController.SendChatMessage(channel, "!train " + this.autoOptions.autoTrainSkill); }, 1500); }
                    
                    setTimeout(() => { if (lastCommand.m) { TwitchController.SendChatMessage(lastCommand.c, lastCommand.m); } }, 3000);
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
                    if (messageFlags.trainingUnjoined) { return true; }
                    if (messageFlags.dungeonUnjoined) { return true; }
                    if (messageFlags.noActiveDungeons) { return true; }
                    if (messageFlags.youNeedToCraft) { return true; }
                    if (messageFlags.alreadyJoined) { return true; }
                    if (messageFlags.alreadyInRaid) { return true; }
                    if (messageFlags.alreadyInDungeon) { return true; }
                    if (messageFlags.cannotStartRaid) { return true; }
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
                    if (messageFlags.specifyCrafting) { return true; }
                    if (messageFlags.youCraftedA) { return true; }
                    if (messageFlags.cannotBeToggled) { return true; }
                    if (messageFlags.beAtCraftingTable) { return true; }
                    if (messageFlags.selectWhatToCraft) { return true; }
                    if (messageFlags.noItemInMarket) { return true; }
                    if (messageFlags.islandLevelGlitch) { return true; }
                    if (messageFlags.itemOnMarket) { return true; }
                    if (messageFlags.currentTraining) { return true; }
                    if (messageFlags.notTraining) { return true; }
                    if (messageFlags.cantCraftYet) { return true; }
                    if (messageFlags.youGifted) { return true; }
                    if (messageFlags.currentMultiplier) { return true; }
                }
                else if (!messageFlags.sentFromStreamer) {
                    if (messageFlags.playerJoining) { return true; }
                    if (messageFlags.playerLeaving) { return true; }
                    if (messageFlags.playerCrafting) { return true; }
                    if (messageFlags.playerRaid) { return true; }
                    if (messageFlags.raidPlayer) { return true; }
                    if (messageFlags.playerDungeon) { return true; }
                    if (messageFlags.playerStats) { return true; }
                    if (messageFlags.playerResource) { return true; }
                    if (messageFlags.playerTraining) { return true; }
                    if (messageFlags.playerToggle) { return true; }
                    if (messageFlags.playerUseMarket) { return true; }
                    if (messageFlags.playerCheckIsland) { return true; }

                    if (messageFlags.isNowLiveMessage && messageFlags.streamElements) { return true; }
                    if (messageFlags.noItemFoundSE && messageFlags.streamElements) { return true; }
                    if (messageFlags.nbSpamWarning && messageFlags.nightbot) { return true; }
                }
            }

            if (iAmStreamer) {
                if (this.autoOptions.allowRaidTrigger && messageFlags.playerRaidTrigger) {
                    this.triggerRaid(message);
                }

                if (this.autoOptions.helpBot && messageFlags.playerSeekingHelp) {
                    helpBotOptions.raidTrigger = this.autoOptions.raidTrigger;
                    let helpResponse = parseHelpCommand(messageLower);
                    if (helpResponse.success) {
                        let sendHelpResponse = null;
                        sendHelpResponse = (helpResponse) => {
                            TwitchController.SendChatMessage(channel, helpResponse.reply[0]);
                            helpResponse.reply.shift();
                            if (sendHelpResponse && (helpResponse.reply.length !== 0)) { setTimeout(() => sendHelpResponse(helpResponse), 500); }
                        };
                        sendHelpResponse(helpResponse);
                    }
                }
            } 

            //  Add a new entry to our on-screen chat
            this.elements.twitchChatContainer.addChatLine(message.username, message.message, messageFlags.relevantToMe);
            return true;
        });
    }

    triggerRaid(triggerMessage) {
        if (!triggerMessage) { TwitchController.SendChatMessage(channel, "!raid start"); return; }

        let secondsSinceLastRaid = Math.round(((new Date()).getTime() - this.lastRaidOccurred) / 1000);
        let autoRaidTriggerSeconds = this.autoRaidTriggerMinutes * 60;
        if (secondsSinceLastRaid > autoRaidTriggerSeconds) { TwitchController.SendChatMessage(channel, "!raid start"); }
        else { TwitchController.SendChatMessage(channel, "Sorry, a raid has occurred very recently. Please wait " + (autoRaidTriggerSeconds - secondsSinceLastRaid).toString() + " seconds and try again."); }
    }

    ShowMainAreaUI(show) {
        this.elements.botControlScreen.setHidden(!show);
        this.elements.botControlScreen.update();
        this.elements.twitchChatContainer.content.style.display = show ? "block" : "none";
    }
}