"use strict";
//Clear Local Storage
let ausloggenButton = document.getElementById("ausloggenButton");
ausloggenButton.addEventListener("click", logout);
function logout(_e) {
    window.localStorage.clear();
}
//# sourceMappingURL=scriptProfil.js.map