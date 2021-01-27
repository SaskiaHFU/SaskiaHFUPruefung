"use strict";
let dataButton = document.getElementById("postButton");
dataButton.addEventListener("click", comment);
async function comment(params) {
    //
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