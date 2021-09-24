const express = require("express");
const bodyParser = require("body-parser");
const emailValidator = require("email-verify");
const ejs = require("ejs");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    console.log("POST req received");
    const firstName = req.body.fName;
    const email = req.body.email;
    console.log("Name >>> " + firstName + " Email >>>> " + email);

    emailValidator.verify(email, function (err, info) {


        console.log("INFO >>>>> " + info.success);
        for (let [key, value] of Object.entries(info)) {
            console.log(`${key}: ${value}`);
        }

        if (!err) {
            if (info.success) {
                res.render("valid", { email:email, username:firstName, info: info.info });
            }
            else {
                res.render("invalid", { email:email, username:firstName, info: info.info });
            }
        }
        else {
            res.render("invalid", { email:email, username:firstName, info: info.info });
        }



    });

});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running successfully");
});