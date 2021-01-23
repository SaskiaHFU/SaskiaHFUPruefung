getUsers();

async function getUsers(): Promise <void> {

    let response: Response = await fetch(mainURL + "user");
    let users: User[] = await response.json();

    let usersDiv: HTMLElement = document.getElementById("users");

    let userCount: number = 0;



    for (let user of users) {

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