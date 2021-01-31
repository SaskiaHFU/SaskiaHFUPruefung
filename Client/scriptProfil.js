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
    // window.location.href = "https://saskiahfu.github.io/SaskiaHFUPruefung/HTML/index.html";
    window.location.href = "file:///C:/Users/User/Documents/Studium/2%20Semester/GIS/SaskiaHFUPruefung/HTML/index.html";
}
//# sourceMappingURL=scriptProfil.js.map