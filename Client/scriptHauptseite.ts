
let postForm: HTMLFormElement = <HTMLFormElement>document.getElementById("post-form");

let currentUser: string = localStorage.getItem("currentUser");

let clearButton1: HTMLButtonElement = <HTMLButtonElement>document.getElementById("resetButton");
clearButton1.addEventListener("click", clearComment);

let postButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("postButton");
postButton.addEventListener("click", sendComment);

function clearComment(_e: Event): void {
    postForm.reset();
}

async function sendComment(): Promise<void> {


    let textArea: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById("writeComment");

    // Append eingeloggter User für Parameter userEmail und Comment weil nicht automatisch weil textarea statt input

    let queryUser: URLSearchParams = new URLSearchParams();

    queryUser.append("email", currentUser);
    queryUser.append("writeComment", textArea.value);



    let queryUrl: string = url + "hauptseite" + "?" + queryUser.toString();
    console.log(queryUrl);


    let response: Response = await fetch(queryUrl);


    let responseField: HTMLParagraphElement = document.createElement("p");

    console.log(response);

    // //Fehler auffangen
    if (response.status != 200) {
        responseField.innerText = "Fehler!";

    }
    else {

        let responseText: string = await response.text();
        let statusCode: StatusCodes = Number.parseInt(responseText) as StatusCodes;

        //Rückmeldung Submit

        if (statusCode == StatusCodes.BadDatabaseProblem) {
            responseField.innerText = "Fehler!";
        }

        else if (statusCode == StatusCodes.Good) {
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

    let serverResult: HTMLDivElement = <HTMLDivElement>document.getElementById("serverresult");
    while (serverResult.hasChildNodes()) {
        serverResult.removeChild(serverResult.firstChild);
    }
    serverResult.appendChild(responseField);

    getComments();
}


async function getComments(): Promise<void> {

    let queryUser: URLSearchParams = new URLSearchParams();
    queryUser.append("email", currentUser);

    let queryUrl: string = url + "getcomments" + "?" + queryUser.toString();

    //Fetch Data vom Server und wandle Data zu JSON
    let response: Response = await fetch(queryUrl);
    let comments: Comment[] = await response.json();

    // console.log(queryUrl);

    // console.log(await JSON.stringify(response));


    let commentsDiv: HTMLElement = document.getElementById("showComments");

    let commentCount: number = 0;
  

    //
    while (commentsDiv.hasChildNodes()) {
        commentsDiv.removeChild(commentsDiv.firstChild);
    }
    //

    for (let comment of comments) {

        let commentDiv: HTMLDivElement = document.createElement("div");

        commentDiv.classList.add("commentDiv");
        commentDiv.innerText = `userEmail: ${comment.userEmail},
                                Text: ${comment.Text},
                                Date: ${comment.Date}   

                                 `;



        console.log(comment);

        commentsDiv.appendChild(commentDiv);

        // commentCount++;
    }

}

window.addEventListener("load", getComments);
