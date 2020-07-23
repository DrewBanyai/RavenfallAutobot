class BotControlScreen {
    constructor(options) {
        this.options = options;
        this.checkboxOptions = { autoRaid: true, autoDungeon: true };
        this.changeOptionsCallback = null;
        this.elements = { autoRaidCheckbox: null, autoDungeonCheckbox: null, };
        this.content = this.generateContent();
    }

    generateContent() {
        let container = new Container({ id: "BotControlScreen", style: { width: "920px", height: "100%", backgroundColor: "rgb(64, 64 ,64)", borderRadius: "6px", }, });

        //  Create the auto raid options checkbox
        let autoRaidCheckboxContainer = new Container({ id: "AutoRaidCheckboxContainer", style: { display: "flex" }, });
        container.appendChild(autoRaidCheckboxContainer.content);

        let autoRaidTitleLabel = new Label({ id: "AutoRaidTitleLabel", attributes: { value: "Auto-Join all raids", }, style: { width: "160px", }, });
        autoRaidCheckboxContainer.appendChild(autoRaidTitleLabel.content);

        this.elements.autoRaidCheckbox = new Checkbox({ id: "AutoRaidCheckbox", style: { margin: "0px 0px 0px 30px", }, checked: true });
        this.elements.autoRaidCheckbox.setClickCallback(() => { this.changeOptions(); });
        autoRaidCheckboxContainer.appendChild(this.elements.autoRaidCheckbox.content);

        //  Create the auto dungeon options checkbox
        let autoDungeonCheckboxContainer = new Container({ id: "AutoDungeonCheckboxContainer", style: { display: "flex", }, });
        container.appendChild(autoDungeonCheckboxContainer.content);

        let autoDungeonTitleLabel = new Label({ id: "AutoDungeonTitleLabel", attributes: { value: "Auto-Join all dungeons", }, style: { width: "160px", }, });
        autoDungeonCheckboxContainer.appendChild(autoDungeonTitleLabel.content);

        this.elements.autoDungeonCheckbox = new Checkbox({ id: "AutoDungeonCheckbox", style: { margin: "0px 0px 0px 30px", }, checked: true });
        this.elements.autoDungeonCheckbox.setClickCallback(() => { this.changeOptions(); });
        autoDungeonCheckboxContainer.appendChild(this.elements.autoDungeonCheckbox.content);

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

        if (optionsChanged ) { this.changeOptionsCallback(this.checkboxOptions); }
    }

    setChangeOptionsCallback(callback) { this.changeOptionsCallback = callback; }
    
    setHidden(hidden) { this.content.style.display = hidden ? "none" : ""; }
}