import React, {useState} from 'react';
import {Button, Dialog, DialogTitle, TextField} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import {API_URL} from "../utils/api_client";

export const UpdateTaskForm = ({
    fetchTasks,
    isDialogueOpen,
    setIsDialogueOpen,
    task
}) => {

    const {id, completed} = task;
    const [taskName, setTaskName] = useState("");

    const handleUpdateTaskName = async () => {
        try{
            await axios.put(API_URL, {
               id,
               name: taskName,
               completed
            });

            await fetchTasks();
            setTaskName("");

        }catch(error){
            console.error("Error updating task name:", error);
        }
    }

    return (
        <Dialog open={isDialogueOpen}>
            <DialogTitle>Edit Task</DialogTitle>
            <div className={"dialog"}>
                <TextField
                    size="small"
                    label="Task"
                    variant="outlined"
                    onChange={(e) => setTaskName(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={ async () => {
                        await handleUpdateTaskName();
                        setIsDialogueOpen(false);
                    }}>
                    <CheckIcon />
                </Button>
            </div>
        </Dialog>
    )
}