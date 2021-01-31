"use strict";
let postForm = document.getElementById("post-form");
let currentUser = localStorage.getItem("currentUser");
let clearButton1 = document.getElementById("resetButton");
clearButton1.addEventListener("click", clearComment);
let postButton = document.getElementById("postButton");
postButton.addEventListener("click", sendComment);
function clearComment(_e) {
    postForm.reset();
}
async function sendComment() {
    let textArea = document.getElementById("writeComment");
    // Append eingeloggter User für Parameter userEmail und Comment weil nicht automatisch weil textarea statt input
    let queryUser = new URLSearchParams();
    queryUser.append("email", currentUser);
    queryUser.append("writeComment", textArea.value);
    let queryUrl = url + "hauptseite" + "?" + queryUser.toString();
    console.log(queryUrl);
    let response = await fetch(queryUrl);
    let responseField = document.createElement("p");
    console.log(response);
    // //Fehler auffangen
    if (response.status != 200) {
        responseField.innerText = "Fehler!";
    }
    else {
        let responseText = await response.text();
        let statusCode = Number.parseInt(responseText);
        //Rückmeldung Submit
        if (statusCode == 2 /* BadDatabaseProblem */) {
            responseField.innerText = "Fehler!";
        }
        else if (statusCode == 1 /* Good */) {
            textArea.value = ""; //Textarea clearen
            responseField.innerText = "Dein Beitrag wird gepostet!";
        }
    }
    //Antwort anzeigen
    // let serverResult: HTMLElement = document.getElementById("serverresult");
    // if (changeLoginResult != undefined) {
    //     serverResult.replaceChild(responseField, changeLoginResult);
    // }
    // else {
    //     serverResult.appendChild(responseField);
    // }
    // changeLoginResult = responseField;
    let serverResult = document.getElementById("serverresult");
    while (serverResult.hasChildNodes()) {
        serverResult.removeChild(serverResult.firstChild);
    }
    serverResult.appendChild(responseField);
    getComments();
}
async function getComments() {
    let queryUser = new URLSearchParams();
    queryUser.append("email", currentUser);
    let queryUrl = url + "getcomments" + "?" + queryUser.toString();
    //Fetch Data vom Server und wandle Data zu JSON
    let response = await fetch(queryUrl);
    let comments = await response.json();
    let commentsDiv = document.getElementById("showComments");
    let commentCount = 0;
    //
    while (commentsDiv.hasChildNodes()) {
        commentsDiv.removeChild(commentsDiv.firstChild);
    }
    //
    for (let comment of comments) {
        let commentDiv = document.createElement("div");
        commentDiv.classList.add("commentDiv");
        commentDiv.innerText = `von ${comment.userEmail},
                                Beitrag: ${comment.Text},
                                um ${comment.Date}   

                                 `;
        console.log(comment);
        commentsDiv.appendChild(commentDiv);
        commentCount++;
    }
}
window.addEventListener("load", getComments);
//# sourceMappingURL=scriptHauptseite.js.map