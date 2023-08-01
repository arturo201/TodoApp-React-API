import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const TASKS_ENDPOINT = "https://64c810e8a1fe0128fbd59b13.mockapi.io/tasks";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch(TASKS_ENDPOINT, {
      method: "GET",
      headers: { "content-type": "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          setError(null);
          return res.json();
        }
        throw new Error("Error fetching tasks");
      })
      .then((tasksData) => {
        setTasks(tasksData);
      })
      .catch((error) => {
        console.error(error);
        setError(error.toString());
      });
  };

  const createTask = () => {
    if (!newTaskContent) {
      setError("Task content cannot be empty.");
      return;
    }

    const newTask = {
      content: newTaskContent,
      completed: false,
    };

    fetch(TASKS_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => {
        if (res.ok) {
          setError(null);
          return res.json();
        }
        throw new Error("Error creating task");
      })
      .then((taskData) => {
        setTasks((prevTasks) => [...prevTasks, taskData]);
        setNewTaskContent("");
      })
      .catch((error) => {
        console.error(error);
        setError(error.toString());
      });
  };

  const markTaskCompleted = (taskId) => {
    fetch(`${TASKS_ENDPOINT}/${taskId}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ completed: true }),
    })
      .then((res) => {
        if (res.ok) {
          setError(null);
          return res.json();
        }
        throw new Error("Error marking task as completed");
      })
      .then((updatedTaskData) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTaskData.id ? updatedTaskData : task
          )
        );
      })
      .catch((error) => {
        console.error(error);
        setError(error.toString());
      });
  };

  const deleteTask = (taskId) => {
    fetch(`${TASKS_ENDPOINT}/${taskId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setError(null);
          return res.json();
        }
        throw new Error("Error deleting task");
      })
      .then((deletedTaskData) => {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== deletedTaskData.id)
        );
      })
      .catch((error) => {
        console.error(error);
        setError(error.toString());
      });
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>

      {error && <p className="alert alert-danger">{error}</p>}

      <div className="mb-3">
        <label htmlFor="newTaskContent" className="form-label">
          New Task:
        </label>
        <input
          type="text"
          id="newTaskContent"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          className="form-control"
        />
        <button onClick={createTask} className="btn btn-primary mt-2">
          Add Task
        </button>
      </div>

      {/* Render existing tasks */}
      <ul className="list-group">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`list-group-item ${task.completed ? "completed" : ""}`}
          >
            <span className="content">{task.content}</span>
            {task.completed ? (
              <span id="badge" className="badge badge-success mx-1">Completed</span>
            ) : (
              <button
                onClick={() => markTaskCompleted(task.id)}
                id="btns" className="btn btn-success mx-1"
              >
                Mark Completed
              </button>
            )}
            <button
              onClick={() => deleteTask(task.id)}
              id="btns" className="btn btn-danger ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
