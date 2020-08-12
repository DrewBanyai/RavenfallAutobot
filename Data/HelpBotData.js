const helpBotOptions = { raidTrigger: false };

let parseHelpCommand = (message) => {
    let isHelpCommand = (message.substr(0, 5) === "!help");
    if (!isHelpCommand) { return { success: false, reason: "Message is a !help command", reply: [ "Failed to parse help command." ] }; }

    if (message === "!help" || message === "!help ") {
        return { success: true, reply: [ "HELP: HelpBot (that's me!) is here to help. Ask me about a specific subject by using the command '!help SUBJECT'. For a list of help subjects, type '!help subjects'" ] };
    }

    let hasSubject = (message.substr(0, 6) === "!help ") && (message.length > 6);
    if (!hasSubject) { return { success: false, reason: "!help command is improperly formatted", reply: [ "Failed to parse help command." ] }; }
    let helpSubject = message.substr(6, message.length - 6);
    
    switch (helpSubject) {
        case "subject":
        case "subjects":
        case "?":
            return { success: true, reply: [
                "HELP Subjects I can currently tell you about: [nugget, ingot, market, gifting, raid, dungeon, sailing, building, inventory, pets]",
            ], };

        case "training":
        case "train all":
            return { success: true, reply: [
                "Your character has a number of skills they can level. Most skills level by training. You can enter '!train all' to train your top three skills all at once.",
                "For other skills, you'll want to !train those specific skill names. For example '!train crafting' will train crafting.",
                "One caveat: Slayer and Health are two skills you can not train through this command. Health levels with overall level, and Slayer levels by fighting in raids and dungeons.",
            ], };

        case "nugget":
        case "nuggets":
            return { success: true, reply: [
                "HELP: You will sometimes be rewarded with Nuggets of a certain type after raids. These are used to build higher level equipment. Some examples are Adamantine Nuggets and Rune Nuggets.",
            ], };

        case "ingot":
        case "ingots":
        case "ore ingot":
        case "ore ingots":
            return { success: true, reply: [
                "HELP: You will sometimes be rewarded with Ore Ingots from raids, mining, or crafting. These are used when crafting higher level equipment. Some examples are Adamantine Nuggets and Rune Nuggets.",
                "HELP: The basic 'Ore Ingot' item comes from mining (!train mining) and then crafting (!train crafting) while you have Ore in your resources (!res)",
            ], };

        case "market":
        case "buying":
        case "selling":
        case "buy":
        case "sell":
            return { success: true, reply: [
                "HELP: You can buy and sell items to other players, or sell the item directly to an NPC for instant money.",
                "HELP: To buy, use the command '!buy ITEM COUNT PRICE' and it will attempt to buy that item that number of times at a maximum of that price.",
                "HELP: To sell, use the command '!sell ITEM COUNT PRICE' and it will place the item on the market at that price. You will have to wait for a buyer",
                "HELP: To sell to a vendor and immediately be paid, use the command '!vendor COUNT ITEM' and you will receive an immediate payment",
            ], };

        case "give":
        case "gift":
        case "giving":
        case "gifting":
            return { success: true, reply: [
                "HELP: To give someone an item or items, use the command '!gift USER COUNT ITEM' and it will transfer the item from you to them. Note: They must be joined to the game.",
            ], };

        case "raid":
        case "raids":
        case "raiding":
            return { success: true, reply: [
                "HELP: Occasionally bosses will spawn and players can join in a 'raid' to try to defeat them. Winning will grant a chance for items. Many items are only available from winning raids. When a raid occurs, type '!raid' to join in",
            ], };

        case "raid start":
        case "raidstart":
            return { success: true, reply: [
                "HELP: RaidTriggerBot is " + ((helpBotOptions.raidTrigger) ? "active! Just chat '!raidstart' and if no raid has been started recently and there is not a raid or dungeon currently active, I will start a raid for you!" : "currently inactive. Only the host can start a raid."),
            ], };

        case "sail":
        case "sailing":
        case "ferry":
            return { success: true, reply: [
                "HELP: You can train the 'sailing' skill by sailing using the commands '!sail away' and '!sail home'. Sailing will bring you to the higher level island or back home, respectively.",
                "HELP: The higher level island is useful for when your attack level is over level 75. You can train there for higher XP gain at that point. Do so by sailing over and then using the train command.",
            ], };

        case "dungeon":
        case "dungeons":
            return { success: true, reply: [
                "HELP: Occasionally, a dungeon run will be announced. A timer will appear on screen and you can type '!dungeon' to sign up to join in the event. When the timer ends, the dungeon begins and everyone who entered will be tossed into the dungeon",
                "HELP: Unlike a raid, if you die in a dungeon you do not get to keep trying. You are tossed back to the island you came from. However, if you took part in the dungeon at all and the boss is defeated by a player, even if you died, you have a chance to win items",
            ], };

        case "building":
        case "buildings":
            return { success: true, reply: [
                "HELP Over time, the game host earns server XP based on players being on the server over time. They can level up the server which earns building placements. The host can then click these placements and choose a building. Assigning a player to a building will give everyone on the server extra XP for the particular stat of the building.",
            ], };
        
        case "items":
        case "inventory":
            return { success: true, reply: [
                "HELP: There are many items you can obtain that can not be seen in game, but are usable in-game. These items are in your inventory. To view them, you can go to https://www.ravenfall.stream/character/inventory and log in using Twitch.",
            ], };

        case "pet":
        case "pets":
            return { success: true, reply: [
                "HELP: After a successful raid or dungeon, you have a chance of being awarded a pet. To change which of your pets are currently active (if you have any), use the command '!toggle pet'.",
            ], };

        default:
            return { success: true, reply: [
                "The help command does not have an entry for string [" + helpSubject +"] but I will try to add one soon.",
            ], };
    }
}