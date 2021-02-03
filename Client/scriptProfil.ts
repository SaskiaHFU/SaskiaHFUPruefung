

//Eventlisteners

let changeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("changeButton");
changeButton.addEventListener("click", changeProfil);


// Data Input

let nameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("name");
let semesterInput: HTMLInputElement = <HTMLInputElement>document.getElementById("semesterangabe");
let studiengangOmb: HTMLInputElement = <HTMLInputElement>document.getElementById("studiengang_omb");
let studiengangMkb: HTMLInputElement = <HTMLInputElement>document.getElementById("studiengang_mkb");
let studiengangMib: HTMLInputElement = <HTMLInputElement>document.getElementById("studiengang_mib");
let emailInput: HTMLInputElement = <HTMLInputElement>document.getElementById("email");
let passwortInput: HTMLInputElement = <HTMLInputElement>document.getElementById("passwort");


//Funktionen

async function showOldData(): Promise<void> {

    let oldData: HTMLDivElement = <HTMLDivElement>document.getElementById("oldData");

    // let response: Response = await fetch(url + "showOldData");
    // let users: User[] = await response.json();

    // let userCount: number = 0;

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
    let email: string = emailInput.value;
    let passwort: string = passwortInput.value;
    let studiengangmib: boolean = studiengangMib.checked;
    let studiengangmkb: boolean = studiengangMkb.checked;
    let studiengangomb: boolean = studiengangOmb.checked;

    let query: URLSearchParams = new URLSearchParams();

    // query.append("oldEmail", currentUser);

    if (!studiengangmib && !studiengangmkb && !studiengangomb) {
    console.log("fehler!!!");
    }
    if (studiengangomb)
    {
        query.append("studiengang", "omb");
    }
    if (studiengangmkb)
    {
        query.append("studiengang", "mkb");
    }
    if (studiengangmib)
    {
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
    
    if (newUser.Studiengang == "omb")
    {
        studiengangOmb.checked = true;
    }
    else if (newUser.Studiengang == "mkb")
    {
        studiengangMkb.checked = true;
        
    }   
    else if (newUser.Studiengang == "mib")
    {
        studiengangMib.checked = true;

    }


    semesterInput.value = newUser.Semester;
    emailInput.value = newUser.Email;

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