class TwitchChatScreen {
    constructor(options) {
        this.options = options;
        this.content = this.generateContent();
    }

    generateContent() {
        let container = new Container({ id: "TwitchChatContainer", style: { width: "918px", minHeight: "360px", display: "none", background: "rgb(120, 120, 120)", padding: "4px 4px 4px 4px", }, });

        return container.content;
    }

    addChatLine(chatUser, chatMessage, highlighted) {
        //  If we have too many lines, get rid of the oldest one
        if (this.content.children.length >= 20) { this.content.removeChild(this.content.children[0]); }

        this.content.appendChild(this.createChatLine(chatUser, chatMessage, highlighted).content);
    }

    createChatLine(chatUser, chatMessage, highlighted) {
        let chatLine = new Container({ id: "ChatLine", style: { width: "920px", display: "flex", }, });

        let usernameLabel = new Label({ id: "ChatUsername", attributes: { value: chatUser + ": " }, style: { display: "inline-flex", fontWeight: "bold" }, });
        chatLine.appendChild(usernameLabel.content);
        
        let messageLabel = new Label({ id: "ChatMessage", attributes: { value: chatMessage }, style: { display: "inline-flex", padding: "0px 0px 0px 6px", }, });
        if (highlighted) {
            messageLabel.content.style.backgroundColor = "rgb(255, 255, 255)";
            messageLabel.content.style.margin = "2px 0px 2px 0px";
        }
        chatLine.appendChild(messageLabel.content);

        return chatLine;
    }

    setHidden(hidden) { this.content.style.display = hidden ? "none" : ""; }
}