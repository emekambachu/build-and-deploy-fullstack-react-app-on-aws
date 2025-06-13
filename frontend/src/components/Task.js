import React, {useState} from 'react';
import {Button, Checkbox, Typography} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {UpdateTaskForm} from "./UpdateTaskForm";
import classNames from "classnames";
import axios from "axios";
import {API_URL} from "../utils/api_client";

export const Task = ({task, fetchTasks}) => {

    const {id, name, completed} = task;
    const [isComplete, setIsComplete] = useState(completed);
    const [isDialogueOpen, setIsDialogueOpen] = useState(false);

    const handleUpdateTaskCompletion = async () => {
        try {
            await axios.put(API_URL, {
                id,
                name,
                completed: !isComplete,
            });
            setIsComplete((prev) => !prev);
        }catch(err) {
            console.error("Error updating task completion:", err);
        }
    }

    const handleDeleteTask = async () => {
        try{
            await axios.delete(`${API_URL}/${id}`);
            await fetchTasks();

        }catch(err) {
            console.error("Error deleting task:", err);
        }
    }

    return (
        <div className={"task"}>

            <div
                className={classNames("flex", {
                    done: isComplete
                })}
            >
                <Checkbox
                    checked={isComplete}
                    onChange={handleUpdateTaskCompletion}
                />
                <Typography variant="h4">
                    {name}
                </Typography>
            </div>

            <div className={"taskButtons"}>
                <Button
                    variant="contained"
                    onClick={() => setIsDialogueOpen(true)}
                >
                    <EditIcon />
                </Button>
                <Button
                    color="error"
                    variant="contained"
                    onClick={handleDeleteTask}
                >
                    <DeleteIcon />
                </Button>
            </div>

            <UpdateTaskForm
                fetchTasks={fetchTasks}
                isDialogueOpen={isDialogueOpen}
                setIsDialogueOpen={setIsDialogueOpen}
                task={task}
            />

        </div>
    )
}