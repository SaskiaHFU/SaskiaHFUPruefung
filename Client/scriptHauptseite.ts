

let dataButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("postButton");
dataButton.addEventListener("click", comment);

async function comment(params:type): Promise <void> {
    
    //
}

async function getComments (): Promise <void> {
    

        let response: Response = await fetch(url + "hauptseite");
        let comments: Comment[] = await response.json();
    
        let commentsDiv: HTMLElement = document.getElementById("comments");
    
        let commentCount: number = 0;
    
        for (let comment of comments) {
    
            let commentDiv: HTMLDivElement = document.createElement("div");
    
            commentDiv.innerText = `Vorname: ${comment.Text}   
                                 
                                 `;
            
            console.log(comment);
    
            commentsDiv.appendChild(commentDiv); 
            commentCount++;
        }
        
        
    
}