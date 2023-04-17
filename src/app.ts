import express, { Application, Request, Response } from 'express';

const app: Application = express();

const PORT: number = 3001;

var bodyparser = require('body-parser')
app.set('trust proxy', true);
app.use(bodyparser.json())
let IPArray: string[] = [];
let microserviceArray: string[] = [];

const timerPing = setInterval(async function() {
    console.log("Starting Ping")
    IPArray.forEach(function(value){
        let response = fetch(value , {
            method: 'GET',
        });
        if (response == undefined){
            var index = IPArray.indexOf(value);
            IPArray.splice(index,1);
            microserviceArray.splice(index,1);
        };
        console.log(value)
    })
    console.log("Ending ping")
}, 5*1000);

app.post('/register', (req: Request, res: Response): void => {
    let IP = req.ip;
    console.log(req.body.microservice)
    let microservice: string = req.body.microservice;
    let port: string = req.body.port
    IP = IP.replace(/^::ffff:/, '');
    IP = "http://" + IP + ":" + port + "/ping"
    IPArray.push(IP);
    microserviceArray.push(microservice);
    res.status(200).send("Registered")
});

app.listen(PORT, (): void => {
    console.log('SERVER IS UP ON PORT:', PORT);
});