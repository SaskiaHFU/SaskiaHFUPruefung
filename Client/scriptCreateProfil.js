"use strict";
//Register
let registerForm1 = document.getElementById("register-form");
let registerButton1 = document.getElementById("registerButton");
registerButton1.addEventListener("click", submitRegister);
async function submitRegister(_event) {
    let formData = new FormData(document.forms[0]);
    let query = new URLSearchParams(formData);
    let queryUrl = mainURL + "create_profil" + "?" + query.toString();
    console.log(queryUrl);
    let response = await fetch(queryUrl);
    let responseField = document.createElement("p");
    console.log(response);
    //Fehler auffangen
    if (response.status != 200) {
        responseField.innerText = "Fehler!";
    }
    else {
        let responseText = await response.text();
        let statusCode = Number.parseInt(responseText);
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
    let serverResult = document.getElementById("serverresult");
    if (changeLoginResult != undefined) {
        serverResult.replaceChild(responseField, changeLoginResult);
    }
    else {
        serverResult.appendChild(responseField);
    }
    changeLoginResult = responseField;
}
//# sourceMappingURL=scriptCreateProfil.js.map