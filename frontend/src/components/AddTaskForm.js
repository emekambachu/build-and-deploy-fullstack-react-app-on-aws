import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import {Button, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import {API_URL} from "../utils/api_client";

export const AddTaskForm = ({fetchTasks}) => {

    const [task, setTask] = useState('');

    const addTask = async () => {
        try{
            await axios.post(API_URL, {
                name: task,
                completed: false
            });

            await fetchTasks();
            setTask('');

        }catch(err){
            console.error("Error adding task:", err);
        }
    }

    return (
        <div>
            <Typography
                align="center"
                variant="h2"
                paddingTop={2}
                paddingBottom={2}
            >
                My Task List
            </Typography>

            <div className="addtaskForm">
                <TextField
                    size="small"
                    label="Task"
                    variant="outlined"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <Button
                    disabled={!task.length}
                    variant="outlined"
                    onClick={addTask}>
                    <AddIcon />
                </Button>
            </div>

        </div>
    )
}