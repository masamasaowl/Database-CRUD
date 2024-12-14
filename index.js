// ================ BASIC SETUP =================

let express = require ("express");
const app = express();
const port = 8080;
const {v4 : uuidv4} = require ("uuid");
const methodOverride = require ("method-override");
const path = require("path");

// new additions
const {faker} = require ("@faker-js/faker");
const mysql = require ("mysql2");
// connection to database
const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    database : "apnacollege",
    password : "aryan2005"
});


app.use(methodOverride("_method"));

app.use(express.urlencoded({extended : true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.set(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));


app.listen(port, () => {
    console.log("App is listening on port : 8080")
});

//  =============================================

// ================== RANDOM USERS ==============
let getRandomUsers = () => {
    return[
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password()
    ];
} ;
// console.log(getRandomUsers());


// =================== INSERT DATA ==============
// Once inserted this section would be commented out
// create the query with a placeholder(?) at the end to insert dynamically
// let q = "INSERT INTO user (id,username,email,password) VALUES ?";

// create the data array to store the users
// let data = [];

// a loop to input 100 random users
// for(let i = 1; i<=100; i++){
//     data.push(getRandomUsers());
// };

// the connection query to run the commands in SQL
// try {
//     connection.query(q, [data],(err,res) => {
//         if(err) throw err;
//         // console.log(res);
//     });
// } catch (err) {
//     console.log(err);
// } 
// connection.end();


// ==================== HOME ===================

app.get("/", (req,res) => {
    // we got an error here as there are two res.send inside one get request
    // res.send("Welcome my friend you are connected to MySQL database via the node server");


    // send the count of total user in the database
    let q = `SELECT count(*) FROM user`;

    // query request
    try {
        connection.query(q,(err,result) => {
            if(err) throw err;
            
            // store the user count to show on webpage 
            let count = result[0]["count(*)"];
            res.render("home.ejs", {count});
        });
    } catch (err) {
        console.log(err);
    }
    connection.end();   
});

// ================== View Route ================
// now we look at the id username and email of all the users
app.get("/user", (req,res) => {
    let q = `SELECT * FROM user`;

    try {
        connection.query(q,(err,users) => {
            if(err) throw err;
            
            res.render("show", {users});      
        });
    } catch (err) {
        console.log(err);
    };
});



// ================== Create Route ===============

