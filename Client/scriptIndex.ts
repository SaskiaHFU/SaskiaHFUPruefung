//Einloggen

let loginForm1: HTMLFormElement = <HTMLFormElement>document.getElementById("login-form");

let loginButton1: HTMLButtonElement = <HTMLButtonElement>document.getElementById("loginButton");
loginButton1.addEventListener("click", submitLogin);

async function submitLogin(): Promise<void> {

    let formData: FormData = new FormData(document.forms[0]);
    let query: URLSearchParams = new URLSearchParams(<any>formData);
    console.log(query);

    let queryUrl: string = mainURL + "index" + "?" + query.toString();
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
        
        if (statusCode == StatusCodes.BadWrongPassword) {
            responseField.innerText = "Das Passwort ist falsch!";
        }
        else if (statusCode == StatusCodes.Good) {
            responseField.innerText = "Du wirst eingeloggt!";
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
