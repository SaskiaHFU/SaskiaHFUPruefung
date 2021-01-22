import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";

//Variablen festlegen

interface User {

    "Name": string;
    "Studiengang": string;
    "Semester": string;
    "Email": string;
    [passwort: string]: string;

}

interface Query {
    [type: string]: string;
}

let databaseUrl: string = "mongodb+srv://Saskia:12345@clustersaskia.vxxmf.mongodb.net/Charlan?retryWrites=true&w=majority";
let user: Mongo.Collection;

connectToDatabase(databaseUrl);

// Status Codes

const enum StatusCodes {
    Good = 1,
    BadDatabaseProblem = 2,
    BadEmailExists = 3,
    BadWrongPassword = 4,
    BadNameExists = 5
}


//Port und Server erstellen

// let port: number = Number (process.env.PORT); //String zu Int umwandeln
let port: number | string = process.env.PORT;


if (port == undefined) { // || isNaN(port)
    port = 8100;
}

// Funktionen aufrufen


startServer(port);
connectToDatabase(databaseUrl);



function startServer(_port: number | string): void {
    //Server erstellen

    let server: Http.Server = Http.createServer();

    console.log("Server starts on port: " + _port);
    server.listen(_port);
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
}

// Funktionen

function handleListen(): void {
    console.log("Listening");
}

async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
    console.log("I hear voices!");

    _response.setHeader("Access-Control-Allow-Origin", "*");

    let q: Url.UrlWithParsedQuery = Url.parse(_request.url, true);

    console.log(q.pathname);
    
    if (q.pathname == "/index") {

        _response.setHeader("content-type", "text/html; charset=utf-8");
        let queryParameters: Query = <Query>q.query;

        let loginResult: StatusCodes = await loginUser(queryParameters.email as string, queryParameters.passwort as string);

        _response.write(String(loginResult));
        console.log("einloggen Seite");

    }
    else if (q.pathname  == "/create_profil") {

        _response.setHeader("content-type", "text/html; charset=utf-8");

        let queryParameters: Query = <Query> q.query;

        let user: User = {

            "Name": queryParameters.name as string,
            "Studiengang": queryParameters.studiengang as string,
            "Semester": queryParameters.semester as string,
            "Email": queryParameters.email as string

        };
        //Passwort extra weil es nicht im Datenbank Profil stehen soll
        user.passwort = queryParameters.passwort as string;

        let registerResult: StatusCodes = await registerUser(user);

        _response.write(String(registerResult));

        console.log("Registrieren Seite");
    }
    else if (q.pathname == "hauptseite") {

        //
    }
    else if (q.pathname == "/profil") {

        //
    }

    else if (q.pathname == "/follower") {

        _response.setHeader("content-type", "application/json; charset=utf-8");

        let users: User[] = await getUsers();

        _response.write(JSON.stringify(users));

        console.log("Liste Seite");
    }

    else {
        if (_request.url) {


        for (let key in q.query) {
            _response.write(key + ":" + q.query[key] + "<br/>");
        }

        let stringJSON: string = JSON.stringify(q.query);
        _response.write(stringJSON);

    }
    }

    _response.end();

}

async function connectToDatabase(_url: string): Promise<void> {
    console.log("Connected to Database");
//_collection: string
    //Create Mongo Client
    let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
    let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(databaseUrl, options);
    await mongoClient.connect();
    console.log("Connected to Client");

    user = mongoClient.db("Charlan").collection("User");
    console.log("Database connection", user != undefined);
}

async function registerUser(_user: User): Promise<StatusCodes> {

    console.log("Registrieren");

    // connectToDatabase(databaseUrl, "User");

    let countDocumentsEmail: number = await user.countDocuments({ "email": _user.email });
    // let countDocumentsName: number = await user.countDocuments({ "name": _user.name });

    if (countDocumentsEmail > 0) {
        // User existiert weil Dokument gefunden also > 0 Dokumente
        return StatusCodes.BadEmailExists;
    }
    // else if (countDocumentsName > 0) {
    //     return StatusCodes.BadNameExists;
    // } 
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

    let countDocuments: number = await user.countDocuments({ "email": _email, "passwort": _passwort });


    //Rückmeldung dass es funktioniert hat
    if (countDocuments > 0) {
        return StatusCodes.Good;
    }

    else {
        return StatusCodes.BadWrongPassword;
    }

}


async function getUsers(): Promise<User[]> {

    console.log("Liste");

    let userDocuments: User[] = await user.find().toArray();

    return userDocuments;

}
    
    





