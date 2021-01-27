window.addEventListener("load", getUsers);

async function getUsers(): Promise<void> {

    let response: Response = await fetch(url + "user");
    let users: User[] = await response.json();

    let usersDiv: HTMLElement = document.getElementById("users");


    for (let user of users) {

        let userCount: number = 0;
        let userDiv: HTMLDivElement = document.createElement("div");

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