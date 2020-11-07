var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require('mongoose');
const fs = require('fs');
const public_key = fs.readFileSync('./key-public.pem');
const jwt = require('jsonwebtoken');
var env = require('node-env-file'); // .env file
env(__dirname + '/.env');
var jwt_decode = require('jwt-decode');

var moment = require('moment');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());


var router = express.Router();

router.get('/', function(req, res) {
    res.send("api-dados");
});

router.get('/tirar/:number', function(req, res) {
    var vals=[];
    //No trae autorizacion
    if(!req.headers.authorization) {
        return res
            .status(403)
            .send({message: "Tu petición no tiene cabecera de autorización"});
    }
    var tokenB = req.headers.authorization.split(" ")[1];
    //var payload = jwt.decode(tokenB, 'fF7fCg6C');
    const bearerHeader =  req.headers.authorization;
    //VALIDACION DE JWT
    if(typeof bearerHeader !== 'undefined'){
    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, public_key, { algorithms: ['RS256'] }, (err) => {
        //se esta enviando un token ya vecido
        if(err !=null){
        if (err.name === 'TokenExpiredError') {
            res.status(470);
            res.send('Whoops, your token has expired!');
        }
        //se envia un token invalido
        if (err.name === 'JsonWebTokenError') {
            
            res.status(471);
            res.send('That JWT is malformed!');
        }
        }
        //si jalo el token
        if (err === null) {
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
            console.log('Your JWT was successfully validated!');
            result=JSON.parse(result);
            res.status(201);
            res.send(result);
            
        }
        
        // Both should be the same
    
    });
    }else{
    console.log("indefinido");
    }
    /*var payload = jwt_decode(tokenB);
    if(payload.exp <= moment().unix()) {
        return res
            .status(401)
            .send({message: "El token ha expirado"});
    }*/
    //req.user = payload.sub;
    //funcionalidad
    
});


app.use(router);

app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
});