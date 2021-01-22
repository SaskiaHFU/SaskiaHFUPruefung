"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
let databaseUrl = "mongodb+srv://Saskia:12345@clustersaskia.vxxmf.mongodb.net/Charlan?retryWrites=true&w=majority";
let user;
connectToDatabase(databaseUrl);
//Port und Server erstellen
// let port: number = Number (process.env.PORT); //String zu Int umwandeln
let port = process.env.PORT;
if (port == undefined) { // || isNaN(port)
    port = 8100;
}
// Funktionen aufrufen
startServer(port);
connectToDatabase(databaseUrl);
function startServer(_port) {
    //Server erstellen
    let server = Http.createServer();
    console.log("Server starts on port: " + _port);
    server.listen(_port);
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
}
// Funktionen
function handleListen() {
    console.log("Listening");
}
async function handleRequest(_request, _response) {
    console.log("I hear voices!");
    _response.setHeader("Access-Control-Allow-Origin", "*");
    let q = Url.parse(_request.url, true);
    console.log(q.pathname);
    if (q.pathname == "/index") {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        let queryParameters = q.query;
        let loginResult = await loginUser(queryParameters.email, queryParameters.passwort);
        _response.write(String(loginResult));
        console.log("einloggen Seite");
    }
    else if (q.pathname == "/create_profil") {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        let queryParameters = q.query;
        let user = {
            "Name": queryParameters.name,
            "Studiengang": queryParameters.studiengang,
            "Semester": queryParameters.semester,
            "Email": queryParameters.email
        };
        //Passwort extra weil es nicht im Datenbank Profil stehen soll
        user.passwort = queryParameters.passwort;
        let registerResult = await registerUser(user);
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
        let users = await getUsers();
        _response.write(JSON.stringify(users));
        console.log("Liste Seite");
    }
    else {
        if (_request.url) {
            for (let key in q.query) {
                _response.write(key + ":" + q.query[key] + "<br/>");
            }
            let stringJSON = JSON.stringify(q.query);
            _response.write(stringJSON);
        }
    }
    _response.end();
}
async function connectToDatabase(_url) {
    console.log("Connected to Database");
    //_collection: string
    //Create Mongo Client
    let options = { useNewUrlParser: true, useUnifiedTopology: true };
    let mongoClient = new Mongo.MongoClient(databaseUrl, options);
    await mongoClient.connect();
    console.log("Connected to Client");
    user = mongoClient.db("Charlan").collection("User");
    console.log("Database connection", user != undefined);
}
async function registerUser(_user) {
    console.log("Registrieren");
    // connectToDatabase(databaseUrl, "User");
    let countDocumentsEmail = await user.countDocuments({ "email": _user.email });
    // let countDocumentsName: number = await user.countDocuments({ "name": _user.name });
    if (countDocumentsEmail > 0) {
        // User existiert weil Dokument gefunden also > 0 Dokumente
        return 3 /* BadEmailExists */;
    }
    // else if (countDocumentsName > 0) {
    //     return StatusCodes.BadNameExists;
    // } 
    else {
        let result = await user.insertOne(_user);
        //Rückmeldung dass es funktioniert hat
        if (result.insertedCount == 1) {
            return 1 /* Good */;
        }
        else {
            return 2 /* BadDatabaseProblem */;
        }
    }
}
async function loginUser(_email, _passwort) {
    console.log("Login");
    // connectToDatabase(url, "User");
    let countDocuments = await user.countDocuments({ "email": _email, "passwort": _passwort });
    //Rückmeldung dass es funktioniert hat
    if (countDocuments > 0) {
        return 1 /* Good */;
    }
    else {
        return 4 /* BadWrongPassword */;
    }
}
async function getUsers() {
    console.log("Liste");
    let userDocuments = await user.find().toArray();
    return userDocuments;
}
//# sourceMappingURL=scriptServer.js.map