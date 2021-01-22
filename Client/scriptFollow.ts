getUsers();

async function getUsers(): Promise <void> {

    let response: Response = await fetch(mainURL + "user");
    let users: User[] = await response.json();

    let usersDiv: HTMLElement = document.getElementById("users");

    let userCount: number = 0;



    for (let user of users) {

        let userDiv: HTMLDivElement = document.createElement("div");

        userDiv.innerText = `Vorname: ${user.vorname}  
                             Nachname: ${user.nachname} 
                             Email: ${user.email} 
                             
                             `;
        
        console.log(user);

        usersDiv.appendChild(userDiv); 
        userCount++;
    }
    
    
}