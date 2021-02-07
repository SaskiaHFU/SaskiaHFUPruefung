"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
let databaseUrl = "mongodb+srv://Saskia:12345@clustersaskia.vxxmf.mongodb.net/Charlan?retryWrites=true&w=majority";
let user;
let comment;
let follower;
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
    let queryParameters = q.searchParams;
    console.log(q);
    console.log(q.pathname);
    if (q.pathname == "/index") {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        let queryParameters = q.searchParams;
        let loginResult = await loginUser(queryParameters.get("email"), queryParameters.get("passwort"));
        _response.write(String(loginResult));
    }
    else if (q.pathname == "/create_profil") {
        _response.setHeader("content-type", "text/html; charset=utf-8");
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
        let queryParameters = q.searchParams;
        //Beiträge anzeigen
        let comments = await getComments(queryParameters);
        _response.write(JSON.stringify(comments));
    }
    else if (q.pathname == "/hauptseite") {
        _response.setHeader("content-type", "text/html; charset=utf-8");
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
    else if (q.pathname == "/showOldData") {
        _response.setHeader("content-type", "application/json; charset=utf-8");
        let users = await showOldData();
        _response.write(JSON.stringify(users));
    }
    else if (q.pathname == "/editProfil") {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        let registerResult = await updateUser(queryParameters);
        _response.write(String(registerResult));
    }
    else if (q.pathname == "/getProfil") {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.write(JSON.stringify(await getUserData(queryParameters)));
    }
    else if (q.pathname == "/getUsers") {
        _response.setHeader("content-type", "application/json; charset=utf-8");
        let users = await getUsers(queryParameters);
        _response.write(JSON.stringify(users));
        console.log("Liste Seite");
    }
    else if (q.pathname == "/getFollowes") {
        _response.setHeader("content-type", "application/json; charset=utf-8");
        console.log(queryParameters.get("currentuser"));
        let userfollows = await follower.find({ User: queryParameters.get("currentuser") }).toArray();
        _response.write(JSON.stringify(userfollows));
    }
    else if (q.pathname == "/follow") {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        if (queryParameters.get("user") == undefined || queryParameters.get("follows") == undefined) {
            _response.write(String(7 /* EmptyFields */));
        }
        else {
            let newFollow = {
                User: queryParameters.get("user"),
                Follows: queryParameters.get("follows")
            };
            let result = await followUser(newFollow);
            _response.write(String(result));
        }
    }
    else if (q.pathname == "/unfollow") {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        let notFollow = {
            User: queryParameters.get("user"),
            Follows: queryParameters.get("unfollows")
        };
        let result = await unfollowUser(notFollow);
        _response.write(String(result));
    }
    else {
        alert("Die Seite ist nicht vorhanden");
        console.log("Fehler");
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
    follower = mongoClient.db("Charlan").collection("Follower");
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
//User
async function getUsers(_params) {
    let userEmail = _params.get("currentuser");
    let userDocuments = await user.find().toArray();
    userDocuments = userDocuments.filter(o => o.Email != userEmail); //Eigenen Acoount aus Follow-Liste nehmen
    return userDocuments;
}
async function followUser(_newFollow) {
    let result = await follower.insertOne({ User: _newFollow.User, Follows: _newFollow.Follows });
    if (result.insertedCount == 1) {
        return 1 /* Good */;
    }
    else {
        return 2 /* BadDatabaseProblem */;
    }
}
async function unfollowUser(_notFollow) {
    await follower.deleteOne({ User: _notFollow.User, Follows: _notFollow.Follows });
    return 1 /* Good */;
}
//Hauptseite
async function getComments(_params) {
    let userfollows = await follower.find({ User: _params.get("email") }).toArray();
    console.log(userfollows);
    let commentDocuments = [];
    for (let key in userfollows) {
        let username = userfollows[key].Follows;
        console.log(username);
        let tempdocs = await comment.find({ userEmail: username }).toArray();
        console.log(tempdocs);
        commentDocuments = commentDocuments.concat(tempdocs);
    }
    let tempdocs2 = await comment.find({ userEmail: _params.get("email") }).toArray();
    commentDocuments = commentDocuments.concat(tempdocs2);
    commentDocuments.sort((a, b) => {
        if (Date.parse(a.Date) > Date.parse(b.Date))
            return -1;
        return Date.parse(a.Date) < Date.parse(b.Date) ? 1 : 0;
    });
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
}
//Profil
async function updateUser(_params) {
    let name = _params.get("username");
    let semester = _params.get("semester");
    let studiengang = _params.get("studiengang");
    let passwort = _params.get("password");
    let email = _params.get("email");
    // Methode von Github Mongo Seite
    if (passwort == "" || passwort == undefined || passwort == null) {
        let result = await user.updateOne({ Email: email }, {
            $set: {
                Name: name,
                Studiengang: studiengang,
                Semester: semester
            }
        });
        if (result.result.ok) {
            return 1 /* Good */;
        }
        else {
            return 2 /* BadDatabaseProblem */;
        }
    }
    else {
        let result = await user.updateOne({ Email: email }, {
            $set: {
                Name: name,
                Studiengang: studiengang,
                Semester: semester,
                passwort: passwort
            }
        });
        if (result.result.ok) {
            return 1 /* Good */;
        }
        else {
            return 2 /* BadDatabaseProblem */;
        }
    }
}
async function getUserData(_params) {
    let userEmail = _params.get("user");
    let profilDocument = await user.find({ Email: userEmail }).toArray();
    let newUser = profilDocument[0];
    return newUser;
}
async function showOldData() {
    let userDocument = await user.find().toArray();
    return userDocument;
}
//# sourceMappingURL=scriptServer.js.map