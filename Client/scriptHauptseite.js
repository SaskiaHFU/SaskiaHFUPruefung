"use strict";
let dataButton = document.getElementById("postButton");
dataButton.addEventListener("click", sendComment);
async function sendComment() {
    let formData = new FormData(document.forms[0]);
    let query = new URLSearchParams(formData);
    let textArea = document.getElementById("writeComment");
    let queryUrl = url + "scriptHauptseite" + "?" + query.toString();
    console.log(queryUrl);
    let response = await fetch(queryUrl);
    let responseField = document.createElement("p");
    //Fehler auffangen
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
            responseField.innerText = "Dein Beitrag wird gepostet!";
        }
    }
    //Antwort anzeigen
    let serverResult = document.getElementById("serverresult");
    if (changeLoginResult != undefined) {
        serverResult.replaceChild(responseField, changeLoginResult);
    }
    else {
        serverResult.appendChild(responseField);
    }
    changeLoginResult = responseField;
}
async function getComments() {
    let response = await fetch(url + "hauptseite");
    let comments = await response.json();
    let commentsDiv = document.getElementById("comments");
    let commentCount = 0;
    for (let comment of comments) {
        let commentDiv = document.createElement("div");
        commentDiv.innerText = `Vorname: ${comment.Text}   
                                 
                                 `;
        console.log(comment);
        commentsDiv.appendChild(commentDiv);
        commentCount++;
    }
}
//# sourceMappingURL=scriptHauptseite.js.map