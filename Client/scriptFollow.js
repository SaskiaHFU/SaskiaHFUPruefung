"use strict";
//User anzeigen
async function getUsers() {
    let response = await fetch(url + "getUsers");
    let users = await response.json();
    let usersDiv = document.getElementById("users");
    let userCount = 0;
    if (response.ok) {
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
            // let iElement: HTMLElement = <HTMLElement>document.createElement("i");
            // let iconText: any = document.createTextNode("&#xf004;");
            // iElement.setAttribute("id", "heart");
            // iElement.className = ("fas");
            buttonElement.innerText = "Follow";
            userDiv.appendChild(buttonElement);
            // buttonElement.appendChild(iElement);
            // iElement.appendChild(iconText);
            userDiv.prepend(img);
            userCount++;
        }
    }
}
window.addEventListener("load", getUsers);
// Follow || Unfollow
async function follow(user) {
    if (!currentUser) {
        alert("Du musst eingeloggt sein!");
        window.location.assign("index.html");
    }
    else {
        let query = new URLSearchParams();
        query.append("user", currentUser);
        query.append("follows", user);
        let queryUrl = url + "/follow" + "?" + query.toString();
        let request = await fetch(queryUrl);
        let response = await request.json();
    }
}
async function unfollow(user) {
    let query = new URLSearchParams();
    query.append("user", currentUser);
    query.append("unfollows", user);
    let queryUrl = url + "/unfollow" + "?" + query.toString();
    let request = await fetch(queryUrl);
    let response = await request.json();
    getUsers();
}
//# sourceMappingURL=scriptFollow.js.map