"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
let databaseUrl = "mongodb+srv://Saskia:12345@clustersaskia.vxxmf.mongodb.net/Charlan?retryWrites=true&w=majority";
let user;
let comment;
connectToDatabase(databaseUrl);
//Port und Server erstellen
let port = process.env.PORT;
if (port == undefined) {
    port = 8100;
}
// Funktionen aufrufen
startServer(port);
// Funktionen
function startServer(_port) {
    //Server erstellen
    let server = Http.createServer();
    console.log("Server starts on port: " + _port);
    server.listen(_port);
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
}
function handleListen() {
    console.log("Listening");
}
async function handleRequest(_request, _response) {
    console.log("I hear voices!");
    _response.setHeader("Access-Control-Allow-Origin", "*");
    let q = new Url.URL(_request.url, "http://localhost:8100"); //Zweite Parameter weil Base gefordert
    console.log(q.pathname);
    if (q.pathname == "/index") {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        let queryParameters = q.searchParams;
        let loginResult = await loginUser(queryParameters.get("email"), queryParameters.get("passwort"));
        _response.write(String(loginResult));
    }
    else if (q.pathname == "/create_profil") {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        let queryParameters = q.searchParams;
        let user = {
            Name: queryParameters.get("name"),
            Studiengang: queryParameters.get("studiengang"),
            Semester: queryParameters.get("semester"),
            Email: queryParameters.get("email"),
            passwort: queryParameters.get("passwort")
        };
        let registerResult = await registerUser(user);
        _response.write(String(registerResult));
        console.log("Registrieren Seite");
    }
    else if (q.pathname == "/getcomments") {
        _response.setHeader("content-type", "application/json; charset=utf-8");
        // let queryParameters: Url.URLSearchParams = q.searchParams;
        //Beiträge anzeigen
        let comments = await getComments();
        _response.write(JSON.stringify(comments));
    }
    else if (q.pathname == "/hauptseite") {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        let queryParameters = q.searchParams;
        let date = new Date();
        let newComment = {
            userEmail: queryParameters.get("email"),
            Text: queryParameters.get("writeComment"),
            Date: date.toUTCString()
        };
        let messageResult = await saveComment(newComment);
        _response.write(String(messageResult));
        console.log("Hauptseite");
    }
    else if (q.pathname == "/profil") {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        let queryParameters = q.searchParams;
        let user = {
            Name: queryParameters.get("name"),
            Studiengang: queryParameters.get("studiengang"),
            Semester: queryParameters.get("semester"),
            Email: queryParameters.get("email"),
            passwort: queryParameters.get("passwort")
        };
        let registerResult = await registerNewUser(user);
        _response.write(String(registerResult));
    }
    else if (q.pathname == "/follow") {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        let users = await follow();
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
async function connectToDatabase(_url) {
    console.log("Connected to Database");
    //Create Mongo Client
    let options = { useNewUrlParser: true, useUnifiedTopology: true };
    let mongoClient = new Mongo.MongoClient(databaseUrl, options);
    await mongoClient.connect();
    console.log("Connected to Client");
    user = mongoClient.db("Charlan").collection("User");
    comment = mongoClient.db("Charlan").collection("Beitrage");
    console.log("Database connection", user != undefined);
}
//Einloggen+Erstellen
async function registerUser(_user) {
    let countDocumentsEmail = await user.countDocuments({ Email: _user.Email });
    let countDocumentsName = await user.countDocuments({ Name: _user.Name });
    if (countDocumentsEmail > 0) {
        return 3 /* BadEmailExists */;
    }
    else if (countDocumentsName > 0) {
        return 5 /* BadNameExists */;
    }
    else if (!_user.Email || !_user.Name || !_user.Studiengang || !_user.Semester || !_user.passwort) {
        return 7 /* EmptyFields */;
    }
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
    let countDocuments = await user.countDocuments({ Email: _email, passwort: _passwort });
    //Rückmeldung dass es funktioniert hat
    if (countDocuments > 0) {
        return 1 /* Good */;
    }
    else {
        return 4 /* BadWrongPassword */;
    }
}
//Follower
async function follow() {
    let userDocuments = await user.find().toArray();
    return userDocuments;
}
//Hauptseite
async function getComments() {
    let commentDocuments = await comment.find().toArray();
    commentDocuments.reverse();
    return commentDocuments;
}
async function saveComment(_comment) {
    if (!_comment.userEmail || !_comment.Text) {
        return 7 /* EmptyFields */;
    }
    else {
        let result = await comment.insertOne(_comment);
        if (result.insertedCount == 1) {
            return 1 /* Good */;
        }
        else {
            return 2 /* BadDatabaseProblem */;
        }
    }
    //Profil
    async function registerNewUser(_user) {
        // Methode von Github Mongo Seite
        let result = await user.updateOne({ Email: _user.Email }, {
            $set: {
                Name: _user.Name,
                Studiengang: _user.Studiengang,
                Semesterangabe: _user.Semester,
                Passwort: _user.passwort
            }
        });
        //Rückmeldung dass es funktioniert hat
        if (result.result.ok) {
            return 1 /* Good */;
        }
        else {
            return 2 /* BadDatabaseProblem */;
        }
    }
    async function getUserData(_changeUser) {
        let profilDocument = await user.findOne({ Email: _changeUser });
        return;
    }
}
//# sourceMappingURL=scriptServer.js.map