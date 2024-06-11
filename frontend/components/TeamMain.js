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
      ${tasks.map((task) => html`<div class="task-row">${task.name}</div>`)}
    </main>
  `;
}
