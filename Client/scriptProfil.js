"use strict";
//Eventlisteners
let changeButton = document.getElementById("changeButton");
changeButton.addEventListener("click", changeProfil);
// Data Input
let nameInput = document.getElementById("name");
let studiengangInput = document.getElementById("studiengang");
let semesterInput = document.getElementById("semesterangabe");
let emailInput = document.getElementById("email");
let passwortInput = document.getElementById("passwort");
//Funktionen
async function changeProfil(_e) {
    let query = new URLSearchParams();
    query.append("Name", nameInput.value);
    query.append("Studiengang", studiengangInput.value);
    query.append("Semester", semesterInput.value);
    query.append("Email", emailInput.value);
    query.append("passwort", passwortInput.value);
    let queryUrl = url + "scriptProfil" + "?" + query.toString();
    let response = await fetch(queryUrl);
    let responseField = document.createElement("p");
    //Fehler auffangen
    if (response.status != 200) {
        responseField.innerText = "Fehler!";
    }
    else {
        let responseText = await response.text();
        let statusCode = Number.parseInt(responseText);
        if (statusCode == 2 /* BadDatabaseProblem */) {
            responseField.innerText = "Fehler!";
        }
        else if (statusCode == 1 /* Good */) {
            responseField.innerText = "Deine Daten wurden geändert!";
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
    getUserData();
}
async function getUserData() {
    let query = new URLSearchParams();
    query.append("user", currentUser);
    query.append("changeUser", currentUser);
    let queryUrl = url + "scriptProfil" + "?" + query.toString();
    let response = await fetch(queryUrl);
    let newUser = await response.json();
    //Data ändern
    nameInput.value = newUser.Name;
    studiengangInput.value = newUser.Studiengang;
    semesterInput.value = newUser.Semester;
    emailInput.value = newUser.Email;
    passwortInput.value = newUser.passwort;
}
//Clear Local Storage
let ausloggenButton = document.getElementById("ausloggenButton");
ausloggenButton.addEventListener("click", logout);
function logout(_e) {
    window.localStorage.clear();
    alert("Du bist ausgeloggt!");
}
//# sourceMappingURL=scriptProfil.js.map