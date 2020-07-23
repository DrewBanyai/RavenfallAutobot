class SiteHeader {
    constructor(options) {
        this.options = options;
        this.loginButton = null;
        this.loginBox = null;
        this.centeredHeader = null;
        this.content = this.generateContent();
    }

    generateContent() {
        //  Create the main container and the centered header box
        let container = new Container({ id: "SiteHeader", style: styleConfig.SiteHeader, });
        this.centeredHeader = new Container({ id: "CenteredHeader", style: { margin: "auto", width: "920px", height: SITE_HEADER_HEIGHT.collapsed, overflow: "hidden", }, });
        container.appendChild(this.centeredHeader.content);

        let siteNameBox = new Container({
            id: "SiteNameBox",
            style: { height: "100%", display: "inline-flex", float: "left", cursor: "pointer", },
        });
        this.centeredHeader.appendChild(siteNameBox.content);
        //  TODO: Make this a link to the main page?

        let loginButtonBox = new Container({
            id: "SiteLoginLogoutBox",
            style: { height: "100%", display: "inline-flex", float: "right", cursor: "pointer", },
            events: {
                click: () => {
                    if (this.loginBox === null) {
                        this.loginBox = new LoginBox({ loginCallback: () => { this.loginButton.content.style.display = "none"; } });
                        this.centeredHeader.appendChild(this.loginBox.content);
                    }
                    else { this.removeLoginBox(); }
                }
            }
        });
        this.centeredHeader.appendChild(loginButtonBox.content);
        //  TODO: Make the login / logout button swap on login

        //  Load the different parts of the header menu
        this.loadSiteNameBox(siteNameBox);
        this.loadSiteLoginLogoutBox(loginButtonBox);

        return container.content;
    }

    removeLoginBox() {
        this.centeredHeader.removeChild(this.loginBox.content);
        this.loginBox = null;
    }

    async loadSiteNameBox(container) {
        let siteTitleLabel = new Label({ id: "SiteNameLabel", attributes: { value: "Ravenfall Auto-Raid reply bot", }, style: styleConfig.SiteTitleLabel, });
        container.appendChild(siteTitleLabel.content);
    }

    async loadSiteLoginLogoutBox(container) {
        this.loginButton = new Label({ id: "SiteLoginButton", attributes: { value: "Login", }, style: styleConfig.SiteLoginLogoutButton, });
        container.appendChild(this.loginButton.content);
    }
}