"use strict";
//Einloggen
let loginForm1 = document.getElementById("login-form");
let loginButton1 = document.getElementById("loginButton");
loginButton1.addEventListener("click", submitLogin);
async function submitLogin() {
    let formData = new FormData(document.forms[0]);
    let query = new URLSearchParams(formData);
    console.log(query);
    let queryUrl = mainURL + "index" + "?" + query.toString();
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
        if (statusCode == 4 /* BadWrongPassword */) {
            responseField.innerText = "Das Passwort ist falsch!";
        }
        else if (statusCode == 1 /* Good */) {
            responseField.innerText = "Du wirst eingeloggt!";
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
//# sourceMappingURL=scriptIndex.js.map