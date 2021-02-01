
//User anzeigen

async function getUsers(): Promise<void> {

    let response: Response = await fetch(url + "getUsers");
    let users: User[] = await response.json();

    let usersDiv: HTMLElement = document.getElementById("users");

    let userCount: number = 0;

    for (let user of users) {

        let userDiv: HTMLDivElement = document.createElement("div");


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


        let img: HTMLImageElement = <HTMLImageElement>document.createElement("img");
        img.src = "../usericon.png";

        img.setAttribute("id", "userIcon");
        userDiv.appendChild(img);
        
        //Heart-Button erzeugen

        let buttonElement: HTMLElement = <HTMLElement>document.createElement("button");
        buttonElement.setAttribute("id", "heart-button");


        let iElement: HTMLElement = <HTMLElement>document.createElement("i");
        let iconText: any = document.createTextNode("&#xf004;");


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

// Follow || Unfollow

async function follow (user:string): Promise <void> {

    if (!currentUser) {
        alert("Du musst eingeloggt sein!");
        window.location.assign("index.html");
    }

    else {

        let query: URLSearchParams = new URLSearchParams();

        query.append("user", currentUser);
        query.append("follows", user);

        let queryUrl: string = url + "/follow" + "?" + query.toString();
        let request: Response = await fetch(queryUrl);
        let response: string = await request.json();

        
    }

    
}


