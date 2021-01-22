//Shared TS

let mainURL: string = "https://saskiagis2020-pruefung.herokuapp.com/";
//"http://localhost:8100/"

let changeLoginResult: HTMLParagraphElement;

//Funktionen

let clearButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("resetButton");
clearButton.addEventListener("click", clear);

function clear (_e: Event): void {
    registerForm.reset();
}



















