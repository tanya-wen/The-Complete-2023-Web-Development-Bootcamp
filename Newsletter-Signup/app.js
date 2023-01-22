const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req,res) {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req,res) {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;

    console.log(email, firstName, lastName)
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})