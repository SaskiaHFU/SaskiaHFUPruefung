import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";

//Variablen festlegen

interface User {

    Name: string;
    Studiengang: string;
    Semester: string;
    Email: string;
    passwort: string;

}

interface Comment {

    userEmail: string;
    Text: string;
    Date: string;
}


let databaseUrl: string = "mongodb+srv://Saskia:12345@clustersaskia.vxxmf.mongodb.net/Charlan?retryWrites=true&w=majority";
let user: Mongo.Collection;
let comment: Mongo.Collection;


connectToDatabase(databaseUrl);

// Status Codes

const enum StatusCodes {
    Good = 1,
    BadDatabaseProblem = 2,
    BadEmailExists = 3,
    BadWrongPassword = 4,
    BadNameExists = 5,
    BadWrongName = 6,
    EmptyFields = 7
}


//Port und Server erstellen


let port: number | string = process.env.PORT;


if (port == undefined) {
    port = 8100;
}

// Funktionen aufrufen


startServer(port);


// Funktionen

function startServer(_port: number | string): void {

    //Server erstellen

    let server: Http.Server = Http.createServer();

    console.log("Server starts on port: " + _port);
    server.listen(_port);
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
}



function handleListen(): void {
    console.log("Listening");
}

async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
    console.log("I hear voices!");

    _response.setHeader("Access-Control-Allow-Origin", "*");

    let q: Url.URL = new Url.URL(_request.url, "http://localhost:8100"); //Zweite Parameter weil Base gefordert




    console.log(q.pathname);

    if (q.pathname == "/index") {

        _response.setHeader("content-type", "text/html; charset=utf-8");
        let queryParameters: Url.URLSearchParams = q.searchParams;

        let loginResult: StatusCodes = await loginUser(queryParameters.get("email"), queryParameters.get("passwort"));

        _response.write(String(loginResult));
        console.log("einloggen Seite");

    }
    else if (q.pathname == "/create_profil") {

        _response.setHeader("content-type", "text/html; charset=utf-8");

        let queryParameters: Url.URLSearchParams = q.searchParams;

        let user: User = {

            Name: queryParameters.get("name"),
            Studiengang: queryParameters.get("studiengang"),
            Semester: queryParameters.get("semester"),
            Email: queryParameters.get("email"),
            passwort: queryParameters.get("passwort")

        };

        

        let registerResult: StatusCodes = await registerUser(user);

        _response.write(String(registerResult));

        console.log("Registrieren Seite");
    }
    else if (q.pathname == "/getcomments") {

        _response.setHeader("content-type", "application/json; charset=utf-8");
        let queryParameters: Url.URLSearchParams = q.searchParams;


        //Beiträge anzeigen

        let comments: Comment[] = await getComments();

        _response.write(JSON.stringify(comments));

        console.log(queryParameters);

    }

    else if (q.pathname == "/hauptseite") {

        _response.setHeader("content-type", "text/html; charset=utf-8");

        let queryParameters: Url.URLSearchParams = q.searchParams;

        let date: Date = new Date();


        let newComment: Comment = {

            userEmail: queryParameters.get("email"),
            Text: queryParameters.get("writeComment"),
            Date: date.toUTCString()

        };

        

        let messageResult: StatusCodes = await saveComment(newComment);

        _response.write(String(messageResult));

        console.log("Hauptseite");


    }
    else if (q.pathname == "/profil") {

        _response.setHeader("content-type", "text/html; charset=utf-8");

        let queryParameters: Url.URLSearchParams = q.searchParams;

        let user: User = {

            Name: queryParameters.get("name"),
            Studiengang: queryParameters.get("studiengang"),
            Semester: queryParameters.get("semester"),
            Email: queryParameters.get("email"),
            passwort: queryParameters.get("passwort")

        };


        let registerResult: StatusCodes = await registerNewUser(user);

        _response.write(String(registerResult));


    }

    else if (q.pathname == "/follower") {

        _response.setHeader("content-type", "application/json; charset=utf-8");

        let users: User[] = await getUsers();

        _response.write(JSON.stringify(users));

        console.log("Liste Seite");
    }

    else {
        // if (_request.url) {

        //     for (let key in q.searchParams) {
        //         _response.write(key + ":" + q.searchParams.get(key) + "<br/>");
        //     }

        //     let stringJSON: string = JSON.stringify(q.searchParams);
        //     _response.write(stringJSON);
        // }

        alert("Fehler");
    }

    _response.end();

}

async function connectToDatabase(_url: string): Promise<void> {
    console.log("Connected to Database");
    // , _collection: string

    //Create Mongo Client
    let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
    let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(databaseUrl, options);
    await mongoClient.connect();
    console.log("Connected to Client");

    user = mongoClient.db("Charlan").collection("User");
    comment = mongoClient.db("Charlan").collection("Beitrage");

    console.log("Database connection", user != undefined);
}

//Einloggen+Erstellen
async function registerUser(_user: User): Promise<StatusCodes> {

    console.log("Registrieren");

    let countDocumentsEmail: number = await user.countDocuments({ Email: _user.Email });
    let countDocumentsName: number = await user.countDocuments({ Name: _user.Name });


    if (countDocumentsEmail > 0) {

        return StatusCodes.BadEmailExists;
    }
    else if (countDocumentsName > 0) {

        return StatusCodes.BadNameExists;
    }
    else if (!_user.Email || !_user.Name || !_user.Studiengang || !_user.Semester || !_user.passwort) {

        return StatusCodes.EmptyFields;
    }
    else {

        let result: Mongo.InsertOneWriteOpResult<any> = await user.insertOne(_user);


        //Rückmeldung dass es funktioniert hat
        if (result.insertedCount == 1) {

            return StatusCodes.Good;
        }

        else {

            return StatusCodes.BadDatabaseProblem;
        }
    }
}


async function loginUser(_email: string, _passwort: string): Promise<StatusCodes> {

    console.log("Login");

    // connectToDatabase(url, "User");

    let countDocuments: number = await user.countDocuments({ Email: _email, passwort: _passwort });

    console.log(_email, _passwort);

    //Rückmeldung dass es funktioniert hat
    if (countDocuments > 0) {
        return StatusCodes.Good;
    }

    else {
        return StatusCodes.BadWrongPassword;
    }

}

//Follower

async function getUsers(): Promise<User[]> {

    let userDocuments: User[] = await user.find().toArray();

    

    return userDocuments;

}


//Hauptseite
async function getComments(): Promise<Comment[]> {


    let commentDocuments: Comment[] = await comment.find().toArray();
    commentDocuments.reverse();
    
    


    return commentDocuments;
}


async function saveComment(_comment: Comment): Promise<StatusCodes> {


    let result: Mongo.InsertOneWriteOpResult<any> = await comment.insertOne(_comment);
    console.log("Save Comment");

    //Rückmeldung dass es funktioniert hat
    if (result.insertedCount == 1) {

        return StatusCodes.Good;
    }
    else {

        return StatusCodes.BadDatabaseProblem;
    }



}




//Profil

async function registerNewUser(_user: User): Promise<StatusCodes> {


    // Methode von Github Mongo Seite
    let result: Mongo.UpdateWriteOpResult = await user.updateOne(

        { Email: _user.Email },
        {
            $set: {
                Name: _user.Name,
                Studiengang: _user.Studiengang,
                Semesterangabe: _user.Semester,
                Passwort: _user.passwort
            }
        });


    //Rückmeldung dass es funktioniert hat
    if (result.result.ok) {

        return StatusCodes.Good;
    }
    else {

        return StatusCodes.BadDatabaseProblem;
    }


}

async function getUserData(_changeUser: string): Promise <User> {

    let profilDocument: User = await user.findOne({Email: _changeUser});
    
    

        
    


    return ;
}








