"use strict";
getUsers();
async function getUsers() {
    let response = await fetch(url + "user");
    let users = await response.json();
    let usersDiv = document.getElementById("users");
    let userCount = 0;
    for (let user of users) {
        let userDiv = document.createElement("div");
        userDiv.innerText = `Vorname: ${user.vorname}  
                             Nachname: ${user.nachname} 
                             Email: ${user.email} 
                             
                             `;
        console.log(user);
        usersDiv.appendChild(userDiv);
        userCount++;
    }
}
//# sourceMappingURL=scriptFollow.js.map