class BotControlScreen {
    constructor(options) {
        this.options = options;
        this.checkboxOptions = { autoRaid: true, autoDungeon: true, helpBot: false, raidTrigger: false };
        this.changeOptionsCallback = null;
        this.elements = { autoRaidCheckbox: null, autoDungeonCheckbox: null, helpBotCheckbox: null, raidTriggerCheckbox: null, streamerOptions: null, };
        this.optionTitleWidth = "200px";
        this.content = this.generateContent();
    }

    generateContent() {
        let container = new Container({ id: "BotControlScreen", style: { width: "920px", height: "100%", backgroundColor: "rgb(64, 64 ,64)", padding: "6px", color: "rgb(200, 200, 200)" }, });

        //  Create the auto raid options checkbox
        let autoRaidCheckboxContainer = new Container({ id: "AutoRaidCheckboxContainer", style: { display: "flex" }, });
        container.appendChild(autoRaidCheckboxContainer.content);

        let autoRaidTitleLabel = new Label({ id: "AutoRaidTitleLabel", attributes: { value: "Auto-Join all raids", }, style: { width: this.optionTitleWidth, }, });
        autoRaidCheckboxContainer.appendChild(autoRaidTitleLabel.content);

        this.elements.autoRaidCheckbox = new Checkbox({ id: "AutoRaidCheckbox", style: { margin: "0px 0px 0px 30px", }, checked: true });
        this.elements.autoRaidCheckbox.setClickCallback(() => { this.changeOptions(); });
        autoRaidCheckboxContainer.appendChild(this.elements.autoRaidCheckbox.content);

        //  Create the auto dungeon options checkbox
        let autoDungeonCheckboxContainer = new Container({ id: "AutoDungeonCheckboxContainer", style: { display: "flex", }, });
        container.appendChild(autoDungeonCheckboxContainer.content);

        let autoDungeonTitleLabel = new Label({ id: "AutoDungeonTitleLabel", attributes: { value: "Auto-Join all dungeons", }, style: { width: this.optionTitleWidth, }, });
        autoDungeonCheckboxContainer.appendChild(autoDungeonTitleLabel.content);

        this.elements.autoDungeonCheckbox = new Checkbox({ id: "AutoDungeonCheckbox", style: { margin: "0px 0px 0px 30px", }, checked: true });
        this.elements.autoDungeonCheckbox.setClickCallback(() => { this.changeOptions(); });
        autoDungeonCheckboxContainer.appendChild(this.elements.autoDungeonCheckbox.content);

        //  If we're the streamer (channel owner), create a section for streamer-related options
        this.elements.streamerOptions = new Container({ id: "StreamerOptions", style: { display: "none", }, })
        container.appendChild(this.elements.streamerOptions.content);

        let streamerOptionsTitleLabel = new Label({ id: "StreamerOptionsTitleLabel", attributes: { value: "Streamer Options:", }, style: { width: this.optionTitleWidth, fontWeight: "bold", color: "rgb(200, 160, 160)", margin: "10px 0px 0px 0px", }, });
        this.elements.streamerOptions.appendChild(streamerOptionsTitleLabel.content);

        //  Create the help bot checkbox
        let helpBotCheckboxContainer = new Container({ id: "HelpBotCheckboxContainer", style: { display: "flex", }, });
        this.elements.streamerOptions.appendChild(helpBotCheckboxContainer.content);

        let helpBotTitleLabel = new Label({ id: "HelpBotTitleLabel", attributes: { value: "Run the '!help' bot", }, style: { width: this.optionTitleWidth, }, });
        helpBotCheckboxContainer.appendChild(helpBotTitleLabel.content);

        this.elements.helpBotCheckbox = new Checkbox({ id: "HelpBotCheckbox", style: { margin: "0px 0px 0px 30px", }, checked: false });
        this.elements.helpBotCheckbox.setClickCallback(() => { this.changeOptions(); });
        helpBotCheckboxContainer.appendChild(this.elements.helpBotCheckbox.content);

        //  Create the raid trigger checkbox
        let raidTriggerCheckboxContainer = new Container({ id: "RaidTriggerCheckboxContainer", style: { display: "flex", }, });
        this.elements.streamerOptions.appendChild(raidTriggerCheckboxContainer.content);

        let raidTriggerTitleLabel = new Label({ id: "RaidTriggerTitleLabel", attributes: { value: "Trigger raids every X minutes", }, style: { width: this.optionTitleWidth, }, });
        raidTriggerCheckboxContainer.appendChild(raidTriggerTitleLabel.content);

        this.elements.raidTriggerCheckbox = new Checkbox({ id: "RaidTriggerCheckbox", style: { margin: "0px 0px 0px 30px", }, checked: false });
        this.elements.raidTriggerCheckbox.setClickCallback(() => { this.changeOptions(); });
        raidTriggerCheckboxContainer.appendChild(this.elements.raidTriggerCheckbox.content);

        return container.content;
    }

    changeOptions() {
        if (!this.changeOptionsCallback) { return; }

        let optionsChanged = false;

        if (this.elements.autoRaidCheckbox && (this.elements.autoRaidCheckbox.getChecked() !== this.checkboxOptions.autoRaid)) {
            this.checkboxOptions.autoRaid = this.elements.autoRaidCheckbox.getChecked();
            optionsChanged = true;
        }

        if (this.elements.autoDungeonCheckbox && (this.elements.autoDungeonCheckbox.getChecked() !== this.checkboxOptions.autoDungeon)) {
            this.checkboxOptions.autoDungeon = this.elements.autoDungeonCheckbox.getChecked();
            optionsChanged = true;
        }

        if (this.elements.helpBotCheckbox && (this.elements.helpBotCheckbox.getChecked() !== this.checkboxOptions.helpBot)) {
            this.checkboxOptions.helpBot = this.elements.helpBotCheckbox.getChecked();
            optionsChanged = true;
        }

        if (this.elements.raidTriggerCheckbox && (this.elements.raidTriggerCheckbox.getChecked() !== this.checkboxOptions.raidTrigger)) {
            this.checkboxOptions.raidTrigger = this.elements.raidTriggerCheckbox.getChecked();
            optionsChanged = true;
        }

        if (optionsChanged) { this.changeOptionsCallback(this.checkboxOptions); }
    }

    update() {
        let streamer = (myUsername === channel);
        this.elements.streamerOptions.content.style.display = (streamer ? "" : "none");
    }

    setChangeOptionsCallback(callback) { this.changeOptionsCallback = callback; }
    
    setHidden(hidden) { this.content.style.display = hidden ? "none" : ""; }
}