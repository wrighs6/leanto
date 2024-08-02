import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";
import TaskForm from "./TaskForm.js";
import TaskDisplay from "./TaskDisplay.js";

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
      <${TaskDisplay} tasks=${tasks} selected=${selected} />
    </main>
  `;
}
