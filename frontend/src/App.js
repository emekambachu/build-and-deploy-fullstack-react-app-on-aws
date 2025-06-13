import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {AddTaskForm} from "./components/AddTaskForm";
import {Task} from "./components/Task";
import axios from 'axios';
import React, {useState, useEffect} from "react";
import {API_URL} from "./utils/api_client";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export default function App() {

    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        try {
            const {data} = await axios.get(API_URL);
            setTasks(data);
        }catch(err) {
            console.error("Error fetching tasks:", err);
        }
    }

    useEffect(async () => {
        await fetchTasks();
    }, []);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <AddTaskForm
                fetchTasks={fetchTasks}
            />

            {
                tasks && tasks.length > 0 ? (
                    tasks.map((task) => (
                        <Task
                            task={task}
                            key={task.id}
                            fetchTasks={fetchTasks}
                        />
                    ))
                ) : (
                    <div className="noTasks">
                        <h2>No tasks available</h2>
                    </div>
                )
            }

        </ThemeProvider>
    );
}
