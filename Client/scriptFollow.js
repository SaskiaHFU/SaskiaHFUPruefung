"use strict";
async function getUsers() {
    let response = await fetch(url + "getUsers");
    let users = await response.json();
    let usersDiv = document.getElementById("users");
    let userCount = 0;
    for (let user of users) {
        let userDiv = document.createElement("div");
        //User erzeugen
        userDiv.classList.add("userDiv");
        userDiv.innerText = `Name: ${user.Name}  
                             Studiengang: ${user.Studiengang} 
                             Semester: ${user.Semester} 
                             Email: ${user.Email} 
                             
                             `;
        console.log(user);
        usersDiv.appendChild(userDiv);
        // Bild erzeugen
        let img = document.createElement("img");
        img.src = "../usericon.png";
        img.setAttribute("id", "userIcon");
        userDiv.appendChild(img);
        //Heart-Button erzeugen
        let buttonElement = document.createElement("button");
        buttonElement.setAttribute("id", "heart-button");
        let iElement = document.createElement("i");
        let iconText = document.createTextNode("&#xf004;");
        iElement.setAttribute("id", "heart");
        iElement.className = ("fas");
        userDiv.appendChild(buttonElement);
        buttonElement.appendChild(iElement);
        iElement.appendChild(iconText);
        userDiv.prepend(img);
        userCount++;
    }
}
window.addEventListener("load", getUsers);
//# sourceMappingURL=scriptFollow.js.map