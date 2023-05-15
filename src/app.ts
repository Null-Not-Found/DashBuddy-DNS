import { error } from 'console';
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
    let count = 0
    IPArray.forEach(function(value){
        let response = fetch(value , {
            method: 'GET',
        }).catch(error => {
            IPArray.splice(count,1);
            microserviceArray.splice(count,1);
        })
        if (response == undefined){
            
        };
        console.log(value)
        count++;
    })
    count = 0;
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

app.get('/get/:microservice', async (req: Request, res: Response) => {
    const nameToFind = req.params.microservice;
    const locations = microserviceArray
        .map((value, index) => value === nameToFind ? index : -1)
        .filter(index => index !== -1);
    
    const randomIndex = Math.floor(Math.random() * locations.length);
    const randomElement = locations[randomIndex];
    let IP = IPArray.at(randomElement)
    
    res.status(200).json({
		"Time": new Date().toUTCString(),
		"data": IP
	});
});

app.listen(PORT, (): void => {
    console.log('SERVER IS UP ON PORT:', PORT);
});