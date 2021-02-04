
//User anzeigen



async function getUsers(): Promise<void> {
    let query: URLSearchParams = new URLSearchParams();
    query.append("currentuser", currentUser);


    let response: Response = await fetch(url + "getUsers" + "?" + query.toString());
    console.log(response);
    let users: User[] = await response.json();

    let response2: Response = await fetch(url + "getFollowes" + "?" + query.toString());
    let userFollows: UserFollows[] = await response2.json();

    let usersDiv: HTMLElement = document.getElementById("users");
    usersDiv.innerHTML = ""; //Leerer String, damit Liste nicht zweimal angezeigt wird beim followen

    // let userCount: number = 0;

    if (response.ok) {

        for (let userfollow of userFollows) {
            console.log(userfollow);
        }

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
            
            iElement.setAttribute("id", "heart");
            iElement.className = ("fas");
            iElement.innerHTML = "&#xf004;";

            buttonElement.appendChild(iElement);

            userDiv.appendChild(buttonElement);
            userDiv.prepend(img);



            if (userFollows.find(x => x.Follows == user.Email)) {

                // buttonElement.innerText = "Unfollow";
                iElement.removeAttribute("class");
                iElement.setAttribute("class", "fas fas-f");
                buttonElement.addEventListener("click", () => unfollow(user.Email));
            }
            else {

                // buttonElement.innerText = "Follow";
                iElement.removeAttribute("class");
                iElement.setAttribute("class", "fas");
                buttonElement.addEventListener("click", () => follow(user.Email));
            }



            // userCount++;

        }
    }
}
window.addEventListener("load", getUsers);

// Follow || Unfollow

async function follow(usermail: string): Promise<void> {

    console.log("follow called");
    let query: URLSearchParams = new URLSearchParams();

    query.append("user", currentUser);
    query.append("follows", usermail);

    let queryUrl: string = url + "follow" + "?" + query.toString();
    let request: Response = await fetch(queryUrl);
    let response: string = await request.text();

    let statusCode: StatusCodes = Number.parseInt(response) as StatusCodes;

    if (statusCode != StatusCodes.Good) {
        console.log(statusCode);
        console.log("fehler");
    }
    else {
        console.log("kein fehler");
    }

    getUsers();

}

async function unfollow(usermail: string): Promise<void> {

    console.log("unfollow called");

    let query: URLSearchParams = new URLSearchParams();

    query.append("user", currentUser);
    query.append("unfollows", usermail);

    let queryUrl: string = url + "unfollow" + "?" + query.toString();

    let request: Response = await fetch(queryUrl);
    let response: string = await request.text();
    let statusCode: StatusCodes = Number.parseInt(response) as StatusCodes;


    

    if (statusCode != 200) {
        responseField.innerText = "Fehler!";

    }

    else {

        if (statusCode == StatusCodes.BadDatabaseProblem) {
            responseField.innerText = "Fehler!";
        }

        else if (statusCode == StatusCodes.Good) {
            responseField.innerText = "Du hast den User abonniert!";
        }
    }

    getUsers();


}


