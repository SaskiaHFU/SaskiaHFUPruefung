
//Register
let registerForm1: HTMLFormElement = <HTMLFormElement>document.getElementById("register-form");

let registerButton1: HTMLButtonElement = <HTMLButtonElement>document.getElementById("registerButton");
registerButton1.addEventListener("click", submitRegister);

async function submitRegister(_event: Event): Promise<void> {

    let formData: FormData = new FormData(document.forms[0]);
    let query: URLSearchParams = new URLSearchParams(<any>formData);


    let queryUrl: string = mainURL + "create_profil" + "?" + query.toString();
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
        // else if (statusCode == StatusCodes.BadNameExists){
        //     responseField.innerText = "Dieser Name existiert bereits!";
        // }

        else if (statusCode == StatusCodes.Good) {
            responseField.innerText = "Du bist Registiert!";

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