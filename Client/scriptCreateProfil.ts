
//Register
let registerForm: HTMLFormElement = <HTMLFormElement>document.getElementById("register-form");

let registerButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("registerButton");
registerButton.addEventListener("click", submitRegister);

let clearButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("resetButton");
clearButton.addEventListener("click", clear);

function clear (_e: Event): void {
    registerForm.reset();
}

async function submitRegister(_event: Event): Promise<void> {

    let formData: FormData = new FormData(document.forms[0]);
    let query: URLSearchParams = new URLSearchParams(<any>formData);

    let currentUser: string = query.get("email");
    let currentPassword: string = query.get("passwort");


    let queryUrl: string = url + "create_profil" + "?" + query.toString();
    console.log(queryUrl);


    let response: Response = await fetch(queryUrl);

    let responseField: HTMLParagraphElement = document.createElement("p");
    
    console.log(response);

    

    //Fehler auffangen
    if (response.status != 200) {
        responseField.innerText = "Fehler!";
        
    } 
    else {

        let responseText: string = await response.text();
        let statusCode: StatusCodes = Number.parseInt(responseText) as StatusCodes;
        
        //Rückmeldung Submit

        if (statusCode == StatusCodes.BadEmailExists) {
            responseField.innerText = "E-Mail ist schon vorhanden!";
        }
        
        else if (statusCode == StatusCodes.BadNameExists) {
            responseField.innerText = "Dieser Name existiert bereits!";
            
            
        } else if ( statusCode == StatusCodes.EmptyFields) {
            responseField.innerText = "Es sind nicht alle Felder ausgefüllt!";

        }

        else if (statusCode == StatusCodes.Good) {

            localStorage.setItem("currentUser", currentUser);
            localStorage.setItem("currentPassword", currentPassword);

            responseField.innerText = "Du bist Registiert!";

            
            window.location.assign("hauptseite.html");

        }

        else if (statusCode == StatusCodes.BadDatabaseProblem) {
            responseField.innerText = "Datenbank Problem";
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