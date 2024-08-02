import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";
import TaskForm from "./TaskForm.js";

function getTasks(selected, tasks) {
  // get all of the tasks from all of the team for the user
  if (selected == "") {
    const allTasks = tasks.map(
      (task) =>
        html`<div class="task-row border">
          <div class="section">${task.name}</div>
          <div class="section">${task.assignedTo}</div>
          <div class="section">${task.dueDate}</div>
          <div class="section">${task.priority}</div>
          <div class="status">${task.status}</div>
        </div>`,
    );
    return allTasks;
  }
  // get all of the tasks for the specified state, i.e. Team 1
  else {
    const teamTasks = tasks.map((task) => {
      if (task.team.id == selected) {
        return html`<div class="task-row border">
          <div class="section">${task.name}</div>
          <div class="section">${task.assignedTo}</div>
          <div class="section">${task.dueDate}</div>
          <div class="section">${task.priority}</div>
          <div class="status">${task.status}</div>
        </div>`;
      }
    });
    return teamTasks;
  }
}

export default function TeamMain({selected}) {
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(async () => {
    const response = await fetch(`https://api.${window.location.host}/tasks`);
    const data = await response.json();
    setTasks(data);
  }, [refresh]);

  return html`
    <main>
      <div class="options">
        <button class="left-button button">Sort</button>
        <button class="left-button button">Filter</button>
      </div>
      <div class="add-task">
        <button class="right-button button" onClick=${() => setFormOpen(true)}>
          Add Task
        </button>
      </div>
      <${TaskForm} open=${formOpen} close=${() => setFormOpen(false)} refresh=${() => setRefresh(!refresh)} selected=${selected} />
      <div class="task-row border">
        <div class="header">Name</div>
        <div class="header">Assigned</div>
        <div class="header">Due Date</div>
        <div class="header">Task Priority</div>
        <div class="header">Task Status</div>
      </div>
      <div id="tasksContainer">${getTasks(selected, tasks)}</div>
    </main>
  `;
}
