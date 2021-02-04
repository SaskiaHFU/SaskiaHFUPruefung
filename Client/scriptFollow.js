"use strict";
//User anzeigen
async function getUsers() {
    let response = await fetch(url + "getUsers");
    console.log(response);
    let users = await response.json();
    let query = new URLSearchParams();
    query.append("currentuser", currentUser);
    let response2 = await fetch(url + "getFollowes" + "?" + query.toString());
    let userFollows = await response2.json();
    let usersDiv = document.getElementById("users");
    usersDiv.innerHTML = ""; //Leerer String, damit Liste nicht zweimal angezeigt wird beim followen
    // let userCount: number = 0;
    if (response.ok) {
        for (let userfollow of userFollows) {
            console.log(userfollow);
        }
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
            // buttonElement.appendChild(iElement);
            // iElement.appendChild(iconText);
            userDiv.appendChild(buttonElement);
            userDiv.prepend(img);
            if (userFollows.find(x => x.Follows == user.Email)) {
                buttonElement.innerText = "Unfollow";
                buttonElement.addEventListener("click", () => unfollow(user.Email));
            }
            else {
                buttonElement.innerText = "Follow";
                buttonElement.addEventListener("click", () => follow(user.Email));
            }
            // userCount++;
        }
    }
}
window.addEventListener("load", getUsers);
// Follow || Unfollow
async function follow(usermail) {
    console.log("follow called");
    let query = new URLSearchParams();
    query.append("user", currentUser);
    query.append("follows", usermail);
    let queryUrl = url + "follow" + "?" + query.toString();
    let request = await fetch(queryUrl);
    let response = await request.text();
    let statusCode = Number.parseInt(response);
    if (statusCode != 1 /* Good */) {
        console.log(statusCode);
        console.log("fehler");
    }
    else {
        console.log("kein fehler");
    }
    getUsers();
}
async function unfollow(usermail) {
    console.log("unfollow called");
    let query = new URLSearchParams();
    query.append("user", currentUser);
    query.append("unfollows", usermail);
    let queryUrl = url + "unfollow" + "?" + query.toString();
    let request = await fetch(queryUrl);
    let response = await request.text();
    let statusCode = Number.parseInt(response);
    if (statusCode != 200) {
        responseField.innerText = "Fehler!";
    }
    else {
        if (statusCode == 2 /* BadDatabaseProblem */) {
            responseField.innerText = "Fehler!";
        }
        else if (statusCode == 1 /* Good */) {
            responseField.innerText = "Du hast den User abonniert!";
        }
    }
    getUsers();
}
//# sourceMappingURL=scriptFollow.js.map