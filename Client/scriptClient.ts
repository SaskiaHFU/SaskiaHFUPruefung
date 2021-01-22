//Shared TS


let mainURL: string = "https://saskiagis2020-pruefung.herokuapp.com/";
//"http://localhost:8100/"

let changeLoginResult: HTMLParagraphElement;


//Interfaces

interface User {

    "Name": string;
    "Studiengang": string;
    "Semester": string;
    "Email": string;
    [passwort: string]: string;

}

//Statuscodes
const enum StatusCodes {
    Good = 1,
    BadDatabaseProblem = 2,
    BadEmailExists = 3,
    BadWrongPassword = 4,
    BadNameExists = 5;
}



//Funktionen

let clearButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("resetButton");
clearButton.addEventListener("click", clear);

function clear (_e: Event): void {
    registerForm.reset();
}



















