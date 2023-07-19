const express = require("express");
const bodyparser = require("body-parser");
const https = require("https");
require("dotenv").config();

const port = process.env.PORT || 3000;

const app = express();

const api_key = process.env.API_KEY;

app.use(express.static("public"));

app.use(bodyparser.urlencoded({extended:true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;
  
    var data={
      members:[
        {
          email_address: email,
          status: "subscribed",
          merge_fields:{
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
    };

    const jsonData =JSON.stringify(data);

    const url = "https://us9.api.mailchimp.com/3.0/lists/4b69233c1e";

    const options = {
      method:"POST",
      auth: `classsikh007:${api_key}`
    }

    const request = https.request(url,options,function(response){
         
         if (response.statusCode === 200){
           res.sendFile(__dirname + "/success.html")
         } else {
          res.sendFile(__dirname + "/failure.html")
         }
      
          response.on("data", function(data){
          console.log(JSON.parse(data))
        })
    })
      request.write(jsonData);
      request.end();
   
})

app.post("/failure", function(req,res){
  res.redirect("/");
})

app.listen(port, function(){
    console.log(`Server is running on port ${port}`);
});
