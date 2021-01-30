//Shared TS


let url: string = "http://localhost:8100/";
// let url: string = "https://saskiagis2020-pruefung.herokuapp.com/";

let changeLoginResult: HTMLParagraphElement;


//Interfaces

interface User {

    Name: string;
    Studiengang: string;
    Semester: string;
    Email: string;
    passwort: string;

}

interface Comment {

    userEmail: string;
    Text: string;
    Date: Date;
}

//Statuscodes

const enum StatusCodes {
    Good = 1,
    BadDatabaseProblem = 2,
    BadEmailExists = 3,
    BadWrongPassword = 4,
    BadNameExists = 5,
    BadWrongName = 6
}



//Funktionen





















