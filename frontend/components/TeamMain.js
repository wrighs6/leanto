import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";

export default function TeamMain() {
  const [tasks, setTasks] = useState([]);

  useEffect(async () => {
    const response = await fetch(`https://api.${window.location.host}/tasks`);
    const data = await response.json();
    setTasks(data);
    console.log(data);
  }, []);

  return html`
    <main>
      <div class="task-row border">
        <div class="header"> Name </div>
        <div class="header"> Assigned </div>
        <div class="header"> Due Date </div>
        <div class="header"> Task Priority </div>
        <div class="header"> Task Status </div>
      </div class="header">
      ${tasks.map(
        (task) =>
          html`<div class="task-row border">
            <div class="section">${task.name}</div>
            <div class="section">${task.assignedTo}</div>
            <div class="section">${task.dueDate}</div>
            <div class="section">${task.priority}</div>
            <div class="status">${task.status}</div>
          </div>`,
      )}
    </main>
  `;
}
