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
        fs.appendFile('log.txt', 'No se tiene cabecera de autorizacion', function(err) {
         // If an error occurred, show it and return
         if(err) return console.error(err);
         // Successfully wrote to the file!
        });
        console.log('La peticion no cuenta con cabecera de autorizacion');
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
             fs.appendFile('log.txt', 'El Token Validado '+bearerToken+' se encuentra expirado\n', function(err) {
             // If an error occurred, show it and return
             if(err) return console.error(err);
             // Successfully wrote to the file!
            });
            res.status(470);
            res.send('Whoops, Tu token ha expirado!!!');
        }
        //se envia un token invalido
        if (err.name === 'JsonWebTokenError') {
             fs.appendFile('log.txt', 'El Token Validado '+bearerToken+' muestra que el JWT esta incorrecto\n', function(err) {
              // If an error occurred, show it and return
              if(err) return console.error(err);
              // Successfully wrote to the file!
            });

            res.status(471);
            res.send('Este JWT esta incorrecto!');
        }
        }else{
            if(parseInt(req.param('number'),10)!=='NaN'){
                var i=0;
                var dados=parseInt(req.param('number'),10);
                for(i=0;i<dados;i++){
                    vals.push(Math.floor(Math.random() * (6 - 1)) + 1);
                }
            }else{
                //vals.push(Math.floor(Math.random() * (6 - 1)) + 1);
               fs.appendFile('log.txt', 'El numero de dados enviado, es incorrecto\n', function(err) {
                  // If an error occurred, show it and return
               if(err) return console.error(err);
                 // Successfully wrote to the file!
               });

                return res
                    .status(400)
                    .send({message: "Numero de dados no es valido"});
            }
            var result=`{
                "dados": [
                    `+vals+`
                ]
              }`;
            fs.appendFile('log.txt', 'El Token Validado '+bearerToken+' se genero exitosamente.\n Se tiene el resultado: '+result, function(err) {
              // If an error occurred, show it and return
              if(err) return console.error(err);
              // Successfully wrote to the file!
            });

            console.log('Se tiene el resultado:');
            console.log(result);
            console.log('Tu JWT fue validado Exitosamente!');
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
