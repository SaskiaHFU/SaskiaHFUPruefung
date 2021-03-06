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

interface UserFollows {

    User: string;
    Follows: string;
}


let databaseUrl: string = "mongodb+srv://Saskia:12345@clustersaskia.vxxmf.mongodb.net/Charlan?retryWrites=true&w=majority";
let user: Mongo.Collection;
let comment: Mongo.Collection;
let follower: Mongo.Collection;


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

    let queryParameters: Url.URLSearchParams = q.searchParams;

    console.log(q);

    console.log(q.pathname);

    if (q.pathname == "/index") {

        _response.setHeader("content-type", "text/html; charset=utf-8");
        let queryParameters: Url.URLSearchParams = q.searchParams;

        let loginResult: StatusCodes = await loginUser(queryParameters.get("email"), queryParameters.get("passwort"));

        _response.write(String(loginResult));


    }
    else if (q.pathname == "/create_profil") {

        _response.setHeader("content-type", "text/html; charset=utf-8");



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

        let comments: Comment[] = await getComments(queryParameters);

        _response.write(JSON.stringify(comments));



    }

    else if (q.pathname == "/hauptseite") {

        _response.setHeader("content-type", "text/html; charset=utf-8");



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
    else if (q.pathname == "/showOldData") {

        _response.setHeader("content-type", "application/json; charset=utf-8");


        let users: User[] = await showOldData();

        _response.write(JSON.stringify(users));


    }

    else if (q.pathname == "/editProfil") {

        _response.setHeader("content-type", "text/html; charset=utf-8");



        let registerResult: StatusCodes = await updateUser(queryParameters);

        _response.write(String(registerResult));


    }
    else if (q.pathname == "/getProfil") {

        _response.setHeader("content-type", "text/html; charset=utf-8");



        _response.write(JSON.stringify(await getUserData(queryParameters)));

    }

    else if (q.pathname == "/getUsers") {

        _response.setHeader("content-type", "application/json; charset=utf-8");


        let users: User[] = await getUsers(queryParameters);

        _response.write(JSON.stringify(users));

        console.log("Liste Seite");
    }

    else if (q.pathname == "/getFollowes") {

        _response.setHeader("content-type", "application/json; charset=utf-8");


        console.log(queryParameters.get("currentuser"));

        let userfollows: UserFollows[] = await follower.find({ User: queryParameters.get("currentuser") }).toArray();

        _response.write(JSON.stringify(userfollows));

    }

    else if (q.pathname == "/follow") {

        _response.setHeader("content-type", "text/html; charset=utf-8");



        if (queryParameters.get("user") == undefined || queryParameters.get("follows") == undefined) {
            _response.write(String(StatusCodes.EmptyFields));
        }
        else {
            let newFollow: UserFollows = {

                User: queryParameters.get("user"),
                Follows: queryParameters.get("follows")

            };

            let result: StatusCodes = await followUser(newFollow);
            _response.write(String(result));
        }



    }

    else if (q.pathname == "/unfollow") {

        _response.setHeader("content-type", "text/html; charset=utf-8");



        let notFollow: UserFollows = {

            User: queryParameters.get("user"),
            Follows: queryParameters.get("unfollows")

        };

        let result: StatusCodes = await unfollowUser(notFollow);
        _response.write(String(result));


    }

    else {
        alert("Die Seite ist nicht vorhanden");
        console.log("Fehler");
    }

    _response.end();

}

async function connectToDatabase(_url: string): Promise<void> {
    console.log("Connected to Database");

    //Create Mongo Client
    let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
    let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(databaseUrl, options);
    await mongoClient.connect();
    console.log("Connected to Client");

    user = mongoClient.db("Charlan").collection("User");
    comment = mongoClient.db("Charlan").collection("Beitrage");
    follower = mongoClient.db("Charlan").collection("Follower");

    console.log("Database connection", user != undefined);
}

//Einloggen+Erstellen

async function registerUser(_user: User): Promise<StatusCodes> {


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



    let countDocuments: number = await user.countDocuments({ Email: _email, passwort: _passwort });


    //Rückmeldung dass es funktioniert hat
    if (countDocuments > 0) {
        return StatusCodes.Good;
    }

    else {
        return StatusCodes.BadWrongPassword;
    }

}

//User

async function getUsers(_params: URLSearchParams): Promise<User[]> {

    let userEmail: string = _params.get("currentuser");


    let userDocuments: User[] = await user.find().toArray();

    userDocuments = userDocuments.filter(o => o.Email != userEmail); //Eigenen Acoount aus Follow-Liste nehmen

    return userDocuments;


}


async function followUser(_newFollow: UserFollows): Promise<StatusCodes> {

    let result: Mongo.InsertOneWriteOpResult<any> = await follower.insertOne({ User: _newFollow.User, Follows: _newFollow.Follows });

    if (result.insertedCount == 1) {

        return StatusCodes.Good;
    }

    else {

        return StatusCodes.BadDatabaseProblem;
    }

}


async function unfollowUser(_notFollow: UserFollows): Promise<StatusCodes> {

    await follower.deleteOne({ User: _notFollow.User, Follows: _notFollow.Follows });

    return StatusCodes.Good;

}


//Hauptseite
async function getComments(_params: URLSearchParams): Promise<Comment[]> {

    let userfollows: UserFollows[] = await follower.find({ User: _params.get("email") }).toArray();

    console.log(userfollows);

    let commentDocuments: Comment[] = [];

    for (let key in userfollows) {

        let username: string = userfollows[key].Follows;
        console.log(username);
        let tempdocs: Comment[] = await comment.find({ userEmail: username }).toArray();
        console.log(tempdocs);
        commentDocuments = commentDocuments.concat(tempdocs);
    }

    let tempdocs2: Comment[] = await comment.find({ userEmail: _params.get("email") }).toArray();
    commentDocuments = commentDocuments.concat(tempdocs2);



    commentDocuments.sort((a, b) => {
        if (Date.parse(a.Date) > Date.parse(b.Date)) return -1;
        return Date.parse(a.Date) < Date.parse(b.Date) ? 1 : 0;
    });


    return commentDocuments;
}


async function saveComment(_comment: Comment): Promise<StatusCodes> {


    if (!_comment.userEmail || !_comment.Text) {

        return StatusCodes.EmptyFields;
    } else {

        let result: Mongo.InsertOneWriteOpResult<any> = await comment.insertOne(_comment);
        if (result.insertedCount == 1) {

            return StatusCodes.Good;
        }

        else {

            return StatusCodes.BadDatabaseProblem;
        }


    }
}


//Profil

async function updateUser(_params: URLSearchParams): Promise<StatusCodes> {

    let name: string = _params.get("username");
    let semester: string = _params.get("semester");
    let studiengang: string = _params.get("studiengang");
    let passwort: string = _params.get("password");
    let email: string = _params.get("email");

    // Methode von Github Mongo Seite
    if (passwort == "" || passwort == undefined || passwort == null) {
        let result: Mongo.UpdateWriteOpResult = await user.updateOne(
            { Email: email },
            {
                $set: {
                    Name: name,
                    Studiengang: studiengang,
                    Semester: semester
                }
            });

        if (result.result.ok) {

            return StatusCodes.Good;
        }
        else {

            return StatusCodes.BadDatabaseProblem;
        }

    }
    else {
        let result: Mongo.UpdateWriteOpResult = await user.updateOne(
            { Email: email },
            {
                $set: {
                    Name: name,
                    Studiengang: studiengang,
                    Semester: semester,
                    passwort: passwort
                }
            });

        if (result.result.ok) {

            return StatusCodes.Good;
        }
        else {

            return StatusCodes.BadDatabaseProblem;
        }

    }

}

async function getUserData(_params: URLSearchParams): Promise<User> {

    let userEmail: string = _params.get("user");


    let profilDocument: User[] = await user.find({ Email: userEmail }).toArray();

    let newUser: User = profilDocument[0];


    return newUser;

}

async function showOldData(): Promise<User[]> {

    let userDocument: User[] = await user.find().toArray();



    return userDocument;

}





