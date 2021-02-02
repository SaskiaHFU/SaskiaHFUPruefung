

//Eventlisteners

let changeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("changeButton");
changeButton.addEventListener("click", changeProfil);


// Data Input

let nameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("name");
let studiengangInput: HTMLInputElement = <HTMLInputElement>document.getElementById("studiengang");
let semesterInput: HTMLInputElement = <HTMLInputElement>document.getElementById("semesterangabe");
let emailInput: HTMLInputElement = <HTMLInputElement>document.getElementById("email");
let passwortInput: HTMLInputElement = <HTMLInputElement>document.getElementById("passwort");


//Funktionen

async function showOldData(): Promise<void> {

    let oldData: HTMLDivElement = <HTMLDivElement>document.getElementById("oldData");

    let response: Response = await fetch(url + "showOldData");
    let users: User[] = await response.json();

    let userCount: number = 0;

    let userDiv: HTMLDivElement = document.createElement("div");


    //User erzeugen

    userDiv.classList.add("userDiv");
    // // userDiv.innerText = `Name: ${currentUser.Name}  
    // //                          Studiengang: ${currentUser.Studiengang} 
    // //                          Semester: ${currentUser.Semester} 
    // //                          Email: ${currentUser.Email} 
                             
    //                          `;

    

    oldData.appendChild(userDiv);

}

window.addEventListener("load", showOldData);

async function changeProfil(_e: MouseEvent): Promise<void> {

    let name: string = nameInput.value;
    let semester: string = semesterInput.value;
    let studiengang: string = studiengangInput.value;
    let email: string = emailInput.value;
    let passwort: string = passwortInput.value;

    let query: URLSearchParams = new URLSearchParams();

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

    let queryUrl: string = url + "editProfil" + "?" + query.toString();

    let response: Response = await fetch(queryUrl);

    let responseField: HTMLParagraphElement = document.createElement("p");

    //Fehler auffangen
    if (response.status != 200) {
        responseField.innerText = "Fehler!";

    }

    else {

        let responseText: string = await response.text();
        let statusCode: StatusCodes = Number.parseInt(responseText) as StatusCodes;

        if (statusCode == StatusCodes.BadDatabaseProblem) {
            responseField.innerText = "Fehler!";
        }

        else if (statusCode == StatusCodes.Good) {
            responseField.innerText = "Deine Daten wurden geändert!";
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

    getUserData();
}

async function getUserData(): Promise<void> {

    let query: URLSearchParams = new URLSearchParams();
    query.append("user", currentUser);
    

    let queryUrl: string = url + "getProfil" + "?" + query.toString();

    let response: Response = await fetch(queryUrl);
    let newUser: User = await response.json();

    //Data ändern
    nameInput.value = newUser.Name;
    studiengangInput.value = newUser.Studiengang;
    semesterInput.value = newUser.Semester;
    emailInput.value = newUser.Email;
    passwortInput.value = newUser.passwort;

}
getUserData();



//Clear Local Storage

let ausloggenButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("ausloggenButton");
ausloggenButton.addEventListener("click", logout);

function logout(_e: MouseEvent): void {

    window.localStorage.clear();

    alert("Du bist ausgeloggt!");

    // window.location.href = "https://saskiahfu.github.io/SaskiaHFUPruefung/HTML/index.html";
    window.location.assign("index.html");

}