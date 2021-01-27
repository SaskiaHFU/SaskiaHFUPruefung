

let dataButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("postButton");
dataButton.addEventListener("click", sendComment);

async function sendComment(): Promise <void> {
    
    let formData: FormData = new FormData(document.forms[0]);
    let query: URLSearchParams = new URLSearchParams(<any>formData);

    let textArea: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("writeComment");



    let queryUrl: string = url + "scriptHauptseite" + "?" + query.toString();
    console.log(queryUrl);

    let response: Response = await fetch(queryUrl);

    let responseField: HTMLParagraphElement = document.createElement("p");
    


    //Fehler auffangen
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
            responseField.innerText = "Dein Beitrag wird gepostet!";

        }

    }

    //Antwort anzeigen
    let serverResult: HTMLElement = document.getElementById("serverresult");
    if (changeLoginResult != undefined) {
        serverResult.replaceChild(responseField, changeLoginResult);
    }
    else {
        serverResult.appendChild(responseField);         
    }
    changeLoginResult = responseField;
 }


async function getComments (): Promise <void> {
    

        let response: Response = await fetch(url + "hauptseite");
        let comments: Comment[] = await response.json();
    
        let commentsDiv: HTMLElement = document.getElementById("comments");
    
        let commentCount: number = 0;
    
        for (let comment of comments) {
    
            let commentDiv: HTMLDivElement = document.createElement("div");
    
            commentDiv.innerText = `Vorname: ${comment.Text}   
                                 
                                 `;
            
            console.log(comment);
    
            commentsDiv.appendChild(commentDiv); 
            commentCount++;
        }
        
        
    
}