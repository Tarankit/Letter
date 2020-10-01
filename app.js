const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  const firstname = req.body.Fname;
  const lastname = req.body.Lname;
  const email = req.body.Eid;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstname,
        LNAME: lastname
      }

    }]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us10.api.mailchimp.com/3.0/lists/653d950517";
  const options = {
    method: "POST",
    auth: "tarankit:f47dcfb91aa1a2a8a074db137696c11c-us10"
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }


    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
});


app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000");
});
