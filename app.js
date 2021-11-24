const express = require("express");
const bodyParser = require("body-parser");
const emailValidator = require("email-verify");
const ejs = require("ejs");
const http = require("http");


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
    // Disposable/Temp-mail = "vamimif889@mainctu.com";
    const email = req.body.email;
    const access_key = "ce043f1c7a184ca11ebecd0eba33c69c";
    const url = "http://apilayer.net/api/check?access_key="+access_key+"&email="+email+"&smtp=1&format=1"
    console.log("Name >>> " + firstName + " Email >>>> " + email);
    http.get(url,function (response){
        console.log(response.statusCode);
        response.on("data", function (data) {
            console.log(data);        
            const emailStatus = JSON.parse(data);       //Converts the hexadecimal data to the Javascript object
            console.log(emailStatus);
            const username = emailStatus.user; //Use JSON VIewer Pro to get the path
            const domain = emailStatus.domain;
            const validFormat = emailStatus.format_valid;
            const validEmail = emailStatus.mx_found;
            const isRoleEmail = emailStatus.role;
            const isFreeProvider = emailStatus.free;
            const isTempEmail = emailStatus.disposable;
            const qualityScore = emailStatus.score;
            if(validFormat && validEmail){
                res.render("valid",{email : email, username:username, domain : domain, validEmail:validEmail, isRoleEmail: isRoleEmail});
            }
            else{
                res.render("invalid",{email : email, username:username, domain : domain, validEmail:validEmail,isRoleEmail: isRoleEmail});
            }
            

        
        })
    });

   /* emailValidator.verify(email, function (err, info) {


        console.log("INFO >>>>> " + info.success);
        for (let [key, value] of Object.entries(info)) {
            console.log(`${key}: ${value}`);
        }

        if (!err) {
            if (info.success) {
                res.render("valid", { email: email, username: firstName, info: info.info });
            }
            else {
                res.render("invalid", { email: email, username: firstName, info: info.info });
            }
        }
        else {
            res.render("invalid", { email: email, username: firstName, info: info.info });
        }



    });*/

});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running successfully");
});