"use strict";
//Eventlisteners
let changeButton = document.getElementById("changeButton");
changeButton.addEventListener("click", changeProfil);
// Data Input
let nameInput = document.getElementById("name");
let semesterInput = document.getElementById("semesterangabe");
let studiengangOmb = document.getElementById("studiengang_omb");
let studiengangMkb = document.getElementById("studiengang_mkb");
let studiengangMib = document.getElementById("studiengang_mib");
let emailInput = document.getElementById("email");
let passwortInput = document.getElementById("passwort");
//Funktionen
async function changeProfil(_e) {
    let name = nameInput.value;
    let semester = semesterInput.value;
    let email = emailInput.value;
    let passwort = passwortInput.value;
    let studiengangmib = studiengangMib.checked;
    let studiengangmkb = studiengangMkb.checked;
    let studiengangomb = studiengangOmb.checked;
    let query = new URLSearchParams();
    // query.append("oldEmail", currentUser);
    if (!studiengangmib && !studiengangmkb && !studiengangomb) {
        console.log("fehler!!!");
    }
    if (studiengangomb) {
        query.append("studiengang", "omb");
    }
    if (studiengangmkb) {
        query.append("studiengang", "mkb");
    }
    if (studiengangmib) {
        query.append("studiengang", "mib");
    }
    if (name) {
        query.append("username", name);
    }
    if (semester) {
        query.append("semester", semester);
    }
    if (email) {
        query.append("email", email);
    }
    if (passwort) {
        query.append("password", passwort);
    }
    let queryUrl = url + "editProfil" + "?" + query.toString();
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
    let queryUrl = url + "getProfil" + "?" + query.toString();
    let response = await fetch(queryUrl);
    let newUser = await response.json();
    //Data ändern
    nameInput.value = newUser.Name;
    if (newUser.Studiengang == "omb") {
        studiengangOmb.checked = true;
    }
    else if (newUser.Studiengang == "mkb") {
        studiengangMkb.checked = true;
    }
    else if (newUser.Studiengang == "mib") {
        studiengangMib.checked = true;
    }
    semesterInput.value = newUser.Semester;
    emailInput.value = newUser.Email;
}
getUserData();
//Clear Local Storage
let ausloggenButton = document.getElementById("ausloggenButton");
ausloggenButton.addEventListener("click", logout);
function logout(_e) {
    window.localStorage.clear();
    alert("Du bist ausgeloggt!");
    window.location.assign("index.html");
}
//# sourceMappingURL=scriptProfil.js.map