import serverless from 'serverless-http';
import express from 'express';
import {fetchTasks, createTask, updateTask, deleteTask} from './task.js';
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3001;

app.use(express.json());

if(process.env.DEVELOPMENT){
    app.use(cors());
}


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    res.send('Hello World!');
});

app.get('/task', async (req, res) => {
    try{
        const tasks = await fetchTasks();
        res.send(tasks.items);

    }catch(err){
        console.log(err);
        res.status(400).send("Error fetching tasks | "+err);
    }
});

app.post('/task', async (req, res) => {
    try{

        const task = req.body;
        const response = await createTask(task);
        res.send(response);

    }catch(err){

        console.log(err);
        res.status(400).send("Error creating tasks | "+err);

    }
});

app.put('/task', async (req, res) => {

    try{

        const task = req.body;
        const response = await updateTask(task);
        res.send(response);

    }catch(err){

        console.log(err);
        res.status(400).send("Error updating tasks | "+err);

    }

});

app.delete('/task/:id', async (req, res) => {

    try{
        const {id} = req.params;
        const response = await deleteTask(id);

    }catch(err){
        console.log(err);
        res.status(400).send("Error Deleting Task | "+err);
    }

});

if(process.env.DEVELOPMENT){
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

export const handler = serverless(app);