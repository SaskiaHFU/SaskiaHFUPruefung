//Clear Local Storage

let ausloggenButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("ausloggenButton");
ausloggenButton.addEventListener("click", logout);

function logout (_e: MouseEvent): void {

    window.localStorage.clear();

}