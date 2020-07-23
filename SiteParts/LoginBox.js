class LoginBox {
    constructor(options) {
        this.options = options;
        this.loginCallback = options.loginCallback;
        this.content = this.generateContent();
    }

    generateContent() {
        let container = new Container({ id: "LoginBox", style: styleConfig.SiteLoginBox, });

        let siteLoginBoxContainer = new Container({ id: "SiteLoginBoxContainer", style: styleConfig.SiteLoginBoxContainer });
        container.appendChild(siteLoginBoxContainer.content);

        let siteLoginLogoutBox = new Container({ id: "SiteLoginLogoutBox", style: styleConfig.SiteLoginBox });
        siteLoginBoxContainer.appendChild(siteLoginLogoutBox.content);

        this.loadTwitchLoginInput(siteLoginLogoutBox);

        return container.content;
    }

    createInputPairing(inputID, title, inputValue) {
        let inputPairing = new Container({ id: inputID + "InputPairing", style: { display: "block", }, });

        let inputTitleLabel = new Label({ id: inputID + "TitleLabel", attributes: { value: title }, style: { padding: "0px 5px 0px 0px", color: "rgb(120, 120, 120)" }, });
        inputPairing.appendChild(inputTitleLabel.content);

        let inputTextInput = new TextInput({ id: inputID + "TextInput", attributes: { value: inputValue }, style: { width: "300px", margin: "0px 5px 0px 5px" }, });
        inputPairing.appendChild(inputTextInput.content);

        inputPairing.getValue = () => { return inputTextInput.getValue(); }
        return inputPairing;
    }

    async loadTwitchLoginInput(element) {
        let twitchDetailsTitleLabel = new Label({ id: "TwitchDetailsTitleLabel", attributes: { value: "Twitch Details", }, style: { fontWeight: "bold", padding: "0px 0px 10px 0px", }, });
        element.appendChild(twitchDetailsTitleLabel.content);

        let twitchChannelName = this.createInputPairing("TwitchChannelName", "Channel Name:", channel)
        element.appendChild(twitchChannelName.content);
        
        let twitchUserName = this.createInputPairing("TwitchBotUserName", "Bot User Name:", username);
        element.appendChild(twitchUserName.content);

        let twitchOAuthToken = this.createInputPairing("TwitchOAuthPassword", "OAuth Password:", token);
        element.appendChild(twitchOAuthToken.content);

        let connectButton = new PrimaryButton({ id: "TwitchConnectButton", secondary: "true", attributes: { value: "connect", }, style: { width: "100px", height: "24px", position: "relative", top: "6px", margin: "0px auto 10px auto", }, });
        connectButton.SetOnClick(async () => {
            let connectResult = await TwitchController.Connect(twitchChannelName.getValue(), twitchUserName.getValue(), twitchOAuthToken.getValue());
            SITE_HEADER.removeLoginBox();
            SITE_MAIN_AREA.ShowChooseCampaignUI(connectResult);
            if (this.loginCallback) { this.loginCallback(); }
        });
        element.appendChild(connectButton.content);
    }
}