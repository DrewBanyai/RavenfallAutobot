// Provide your token, the bot username and channel. You can generate a token here: https://twitchapps.com/tmi/
let token = "";
let username = "";
let channel = "";
let myUsername = "";

let getTwitchOptionsInURL = () => {
    let queryString = window.location.search;
    if (!queryString || (queryString.length <= 1) || (queryString[0] !== "?")) { return {}; }
    queryString = queryString.substr(1, queryString.length - 1);

    const queryList = queryString.split("&");
    let queryLibrary = {};
    for (let i = 0; i < queryList.length; ++i) {
        let queryParts = queryList[i].split("=");
        if (!queryParts || queryParts.length !== 2) { return; }
        queryLibrary[queryParts[0]] = queryParts[1];
    }

    return queryLibrary;
}

const twitchURLOptions = getTwitchOptionsInURL();

if (twitchURLOptions && twitchURLOptions.token) { token = "oauth:" + twitchURLOptions.token; }
if (twitchURLOptions && twitchURLOptions.username) { username = twitchURLOptions.username; }
if (twitchURLOptions && twitchURLOptions.channel) { channel = twitchURLOptions.channel; }