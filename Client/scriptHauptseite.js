"use strict";
let postForm = document.getElementById("post-form");
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
        else if (statusCode == 7 /* EmptyFields */) {
            responseField.innerText = "Es sind nicht alle Felder ausgefüllt!";
        }
        else if (statusCode == 1 /* Good */) {
            textArea.value = ""; //Textarea clearen
            window.location.assign("hauptseite.html");
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
    let queryUser = new URLSearchParams();
    queryUser.append("email", currentUser);
    let queryUrl = url + "getcomments" + "?" + queryUser.toString();
    //Fetch Data vom Server und wandle Data zu JSON
    let response = await fetch(queryUrl);
    let comments = await response.json();
    let commentsDiv = document.getElementById("showComments");
    for (let comment of comments) {
        let commentDiv = document.createElement("div");
        commentDiv.classList.add("commentDiv");
        commentDiv.innerText = `von ${comment.userEmail}:
                                 ${comment.Text},
                                am ${comment.Date}   

                                 `;
        console.log(comment);
        commentsDiv.appendChild(commentDiv);
    }
}
window.addEventListener("load", getComments);
//# sourceMappingURL=scriptHauptseite.js.map