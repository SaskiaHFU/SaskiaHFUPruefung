"use strict";
getUsers();
async function getUsers() {
    let response = await fetch(URL + "user");
    let users = await response.json();
    let usersDiv = document.getElementById("users");
    let userCount = 0;
    for (let user of users) {
        let userDiv = document.createElement("div");
        userDiv.innerText = `Name: ${user.Name}  
                             Studiengang: ${user.Studiengang} 
                             Semester: ${user.Semester} 
                             Email: ${user.Email} 
                             
                             `;
        console.log(user);
        usersDiv.appendChild(userDiv);
        userCount++;
    }
}
//# sourceMappingURL=scriptFollow.js.map