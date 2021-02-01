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
// async function showOldData(): Promise<void> {
//     let oldData: HTMLDivElement = <HTMLDivElement>document.getElementById("oldData");
//     let response: Response = await fetch(url + "follower");
//     let users: User[] = await response.json();
//     let userCount: number = 0;
//     let userDiv: HTMLDivElement = document.createElement("div");
//     //User erzeugen
//     userDiv.classList.add("userDiv");
//     userDiv.innerText = `Name: ${currentUser.Name}  
//                              Studiengang: ${currentUser.Studiengang} 
//                              Semester: ${currentUser.Semester} 
//                              Email: ${currentUser.Email} 
//                              `;
//     console.log(currentUser);
//     oldData.appendChild(userDiv);
// }
// window.addEventListener("load", showOldData);
async function changeProfil(_e) {
    let name = nameInput.value;
    let semester = semesterInput.value;
    let studiengang = studiengangInput.value;
    let email = emailInput.value;
    let passwort = passwortInput.value;
    let query = new URLSearchParams();
    query.append("oldEmail", currentUser);
    if (name) {
        query.append("Name", name);
    }
    if (studiengang) {
        query.append("Studiengang", studiengang);
    }
    if (semester) {
        query.append("Semester", semester);
    }
    if (email) {
        query.append("Email", email);
    }
    if (passwort) {
        query.append("passwort", passwort);
    }
    // if (passwort !== "" && passwort != currentPasswort) {
    //     responseField.innerText = "Das Passwort stimmt nicht!";
    // }
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
    studiengangInput.value = newUser.Studiengang;
    semesterInput.value = newUser.Semester;
    emailInput.value = newUser.Email;
    passwortInput.value = newUser.passwort;
}
getUserData();
//Clear Local Storage
let ausloggenButton = document.getElementById("ausloggenButton");
ausloggenButton.addEventListener("click", logout);
function logout(_e) {
    window.localStorage.clear();
    alert("Du bist ausgeloggt!");
    // window.location.href = "https://saskiahfu.github.io/SaskiaHFUPruefung/HTML/index.html";
    window.location.assign("index.html");
}
//# sourceMappingURL=scriptProfil.js.map