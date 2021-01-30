"use strict";
//Einloggen
let loginForm1 = document.getElementById("login-form");
let loginButton1 = document.getElementById("loginButton");
loginButton1.addEventListener("click", submitLogin);
//Funktionen
async function submitLogin() {
    let formData = new FormData(document.forms[0]);
    let query = new URLSearchParams(formData);
    let currentUser = query.get("email");
    let currentPassword = query.get("passwort");
    let queryUrl = url + "index" + "?" + query.toString();
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
        // else if (statusCode == StatusCodes.BadWrongName) {
        //     responseField.innerText = "Der Name ist falsch!";
        // }
        else if (statusCode == 1 /* Good */) {
            responseField.innerText = "Du wirst eingeloggt!";
            localStorage.setItem("currentUser", currentUser);
            localStorage.setItem("currentPassword", currentPassword);
            window.location.href = "hauptseite.html";
            // window.location.href = "file:///C:/Users/User/Documents/Studium/2%20Semester/GIS/SaskiaHFUPruefung/HTML/hauptseite.html";
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