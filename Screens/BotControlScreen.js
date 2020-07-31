class BotControlScreen {
    constructor(options) {
        this.options = options;
        this.checkboxOptions = { autoRaid: true, autoDungeon: true, helpBot: false, autoRaidTrigger: false, allowRaidTrigger: false };
        this.changeOptionsCallback = null;
        this.elements = { autoRaidCheckbox: null, autoDungeonCheckbox: null, helpBotCheckbox: null, autoRaidTriggerCheckbox: null, allowRaidTriggerCheckbox: null, streamerOptions: null, };
        this.optionTitleWidth = "300px";
        this.content = this.generateContent();
    }

    generateContent() {
        let container = new Container({ id: "BotControlScreen", style: { width: "920px", height: "100%", backgroundColor: "rgb(64, 64 ,64)", padding: "6px", color: "rgb(200, 200, 200)" }, });

        //  Create the auto raid options checkbox
        let autoRaidCheckboxContainer = new Container({ id: "AutoRaidCheckboxContainer", style: { display: "flex", margin: "0px 0px 2px 0px", }, });
        container.appendChild(autoRaidCheckboxContainer.content);

        let autoRaidTitleLabel = new Label({ id: "AutoRaidTitleLabel", attributes: { value: "Auto-Join all raids", }, style: { width: this.optionTitleWidth, }, });
        autoRaidCheckboxContainer.appendChild(autoRaidTitleLabel.content);

        this.elements.autoRaidCheckbox = new Checkbox({ id: "AutoRaidCheckbox", style: { margin: "0px 0px 0px 30px", }, checked: true });
        this.elements.autoRaidCheckbox.setClickCallback(() => { this.changeOptions(); });
        autoRaidCheckboxContainer.appendChild(this.elements.autoRaidCheckbox.content);

        //  Create the auto dungeon options checkbox
        let autoDungeonCheckboxContainer = new Container({ id: "AutoDungeonCheckboxContainer", style: { display: "flex", margin: "0px 0px 2px 0px", }, });
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
        let helpBotCheckboxContainer = new Container({ id: "HelpBotCheckboxContainer", style: { display: "flex", margin: "0px 0px 2px 0px", }, });
        this.elements.streamerOptions.appendChild(helpBotCheckboxContainer.content);

        let helpBotTitleLabel = new Label({ id: "HelpBotTitleLabel", attributes: { value: "Run the '!help' bot", }, style: { width: this.optionTitleWidth, }, });
        helpBotCheckboxContainer.appendChild(helpBotTitleLabel.content);

        this.elements.helpBotCheckbox = new Checkbox({ id: "HelpBotCheckbox", style: { margin: "0px 0px 0px 30px", }, checked: false });
        this.elements.helpBotCheckbox.setClickCallback(() => { this.changeOptions(); });
        helpBotCheckboxContainer.appendChild(this.elements.helpBotCheckbox.content);

        //  Create the auto raid trigger checkbox
        let autoRaidTriggerCheckboxContainer = new Container({ id: "AutoRaidTriggerCheckboxContainer", style: { display: "flex", margin: "0px 0px 2px 0px", }, });
        this.elements.streamerOptions.appendChild(autoRaidTriggerCheckboxContainer.content);

        let autoRaidTriggerTitleLabel = new Label({ id: "AutoRaidTriggerTitleLabel", attributes: { value: "Automatically trigger raids every few minutes", }, style: { width: this.optionTitleWidth, }, });
        autoRaidTriggerCheckboxContainer.appendChild(autoRaidTriggerTitleLabel.content);

        this.elements.autoRaidTriggerCheckbox = new Checkbox({ id: "AutoRaidTriggerCheckbox", style: { margin: "0px 0px 0px 30px", }, checked: false });
        this.elements.autoRaidTriggerCheckbox.setClickCallback(() => { this.changeOptions(); });
        autoRaidTriggerCheckboxContainer.appendChild(this.elements.autoRaidTriggerCheckbox.content);

        //  Create the allow raid triggers checkbox
        let allowRaidTriggerCheckboxContainer = new Container({ id: "AllowRaidTriggerCheckboxContainer", style: { display: "flex", margin: "0px 0px 2px 0px", }, });
        this.elements.streamerOptions.appendChild(allowRaidTriggerCheckboxContainer.content);

        let allowRaidTriggerTitleLabel = new Label({ id: "AllowRaidTriggerTitleLabel", attributes: { value: "Allow users to trigger raids with !raidstart", }, style: { width: this.optionTitleWidth, }, });
        allowRaidTriggerCheckboxContainer.appendChild(allowRaidTriggerTitleLabel.content);

        this.elements.allowRaidTriggerCheckbox = new Checkbox({ id: "AllowRaidTriggerCheckbox", style: { margin: "0px 0px 0px 30px", }, checked: false });
        this.elements.allowRaidTriggerCheckbox.setClickCallback(() => { this.changeOptions(); });
        allowRaidTriggerCheckboxContainer.appendChild(this.elements.allowRaidTriggerCheckbox.content);

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

        if (this.elements.autoRaidTriggerCheckbox && (this.elements.autoRaidTriggerCheckbox.getChecked() !== this.checkboxOptions.autoRaidTrigger)) {
            this.checkboxOptions.autoRaidTrigger = this.elements.autoRaidTriggerCheckbox.getChecked();
            optionsChanged = true;
        }

        if (this.elements.allowRaidTriggerCheckbox && (this.elements.allowRaidTriggerCheckbox.getChecked() !== this.checkboxOptions.allowRaidTrigger)) {
            this.checkboxOptions.allowRaidTrigger = this.elements.allowRaidTriggerCheckbox.getChecked();
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