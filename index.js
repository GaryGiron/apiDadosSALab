var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');
//var jwt = require('jwt-simple');
var env = require('node-env-file'); // .env file
env(__dirname + '/.env');
var jwt_decode = require('jwt-decode');

var moment = require('moment');
//var config = require('./config');;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.get('/', function(req, res) {
    res.send("api-dados");
});

router.get('/tirar/:number', function(req, res) {
    var vals=[];
    if(!req.headers.authorization) {
        return res
            .status(403)
            .send({message: "Tu petición no tiene cabecera de autorización"});
    }
    var tokenB = req.headers.authorization.split(" ")[1];
    //var payload = jwt.decode(tokenB, 'fF7fCg6C');
    var payload = jwt_decode(tokenB);
    if(payload.exp <= moment().unix()) {
        return res
            .status(401)
            .send({message: "El token ha expirado"});
    }
    //req.user = payload.sub;
    //funcionalidad
    if(parseInt(req.param('number'),10)!=='NaN'){
        var i=0;
        var dados=parseInt(req.param('number'),10);
        for(i=0;i<dados;i++){
            vals.push(Math.floor(Math.random() * (6 - 1)) + 1);
        }
    }else{
        //vals.push(Math.floor(Math.random() * (6 - 1)) + 1);
        return res
            .status(400)
            .send({message: "Numero de dados no es valido"});
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