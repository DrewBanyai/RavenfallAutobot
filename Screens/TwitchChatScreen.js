class TwitchChatScreen {
    constructor(options) {
        this.options = options;
        this.content = this.generateContent();
    }

    generateContent() {
        let container = new Container({ id: "TwitchChatContainer", style: { width: "918px", minHeight: "360px", display: "none", background: "rgb(120, 120, 120)", padding: "4px 4px 4px 4px", }, });

        return container.content;
    }

    createChatLine(chatUser, chatMessage) { 
        let chatLine = new Container({ id: "ChatLine", style: { width: "920px", display: "flex", }, });

        let usernameLabel = new Label({ id: "ChatUsername", attributes: { value: chatUser + ": " }, style: { display: "inline-flex", fontWeight: "bold" }, });
        chatLine.appendChild(usernameLabel.content);
        
        let messageLabel = new Label({ id: "ChatMessage", attributes: { value: chatMessage }, style: { display: "inline-flex", padding: "0px 0px 0px 6px", }, });
        chatLine.appendChild(messageLabel.content);

        this.content.appendChild(chatLine.content);
    }

    setHidden(hidden) { this.content.style.display = hidden ? "none" : ""; }
}