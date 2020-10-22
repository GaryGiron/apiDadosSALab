var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.get('/', function(req, res) {
    res.send("api-dados");
});

router.get('/tirar/:number', function(req, res) {
    var vals=[];
    if(parseInt(req.param('number'),10)!=='NaN'){
        var i=0;
        var dados=parseInt(req.param('number'),10);
        for(i=0;i<dados;i++){
            vals.push(Math.floor(Math.random() * (6 - 1)) + 1);
        }
    }else{
        vals.push(Math.floor(Math.random() * (6 - 1)) + 1);
    }
    var result=`{
        "dados": [
            `+vals+`
        ]
      }`;
    result=JSON.parse(result);
    res.send(result);
});


app.use(router);

app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
});