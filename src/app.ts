import express, { Application, Request, Response } from 'express';

const app: Application = express();

const PORT: number = 3001;

var ping = require('ping');
var bodyparser = require('body-parser')
app.set('trust proxy', true);
app.use(bodyparser.json())
let IPArray: String[] = [];
let microserviceArray: String[] = [];

const timerPing = setInterval(async function() {
    console.log("Starting Ping")
    IPArray.forEach(function(value){
        ping.sys.probe(value + "/ping", function(isAlive:boolean){
            console.log(value)
            if (!isAlive){
                var index = IPArray.indexOf(value);
                console.log(microserviceArray[index])
                IPArray.splice(index, 1);
                microserviceArray.splice(index, 1);
            }
        });
    })
    console.log("Ending ping")
}, 5*1000);

app.post('/register', (req: Request, res: Response): void => {
    let IP = req.ip;
    console.log(req.body.microservice)
    let microservice: String = req.body.microservice;
    IPArray.push(IP);
    microserviceArray.push(microservice);
    res.status(200).send("Registered")
});

app.listen(PORT, (): void => {
    console.log('SERVER IS UP ON PORT:', PORT);
});