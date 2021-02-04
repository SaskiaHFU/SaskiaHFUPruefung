"use strict";
//Register
let registerForm = document.getElementById("register-form");
let registerButton = document.getElementById("registerButton");
registerButton.addEventListener("click", submitRegister);
let clearButton = document.getElementById("resetButton");
clearButton.addEventListener("click", clear);
function clear(_e) {
    registerForm.reset();
}
async function submitRegister(_event) {
    let formData = new FormData(document.forms[0]);
    let query = new URLSearchParams(formData);
    let currentUser = query.get("email");
    let currentPassword = query.get("passwort");
    let queryUrl = url + "create_profil" + "?" + query.toString();
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
        if (statusCode == 3 /* BadEmailExists */) {
            responseField.innerText = "E-Mail ist schon vorhanden!";
        }
        else if (statusCode == 5 /* BadNameExists */) {
            responseField.innerText = "Dieser Name existiert bereits!";
        }
        else if (statusCode == 7 /* EmptyFields */) {
            responseField.innerText = "Es sind nicht alle Felder ausgefüllt!";
        }
        else if (statusCode == 1 /* Good */) {
            localStorage.setItem("currentUser", currentUser);
            localStorage.setItem("currentPassword", currentPassword);
            responseField.innerText = "Du bist Registiert!";
            window.location.assign("hauptseite.html");
        }
        else if (statusCode == 2 /* BadDatabaseProblem */) {
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