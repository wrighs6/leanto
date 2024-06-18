import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";

function addTask() {
  console.log("Hello World\n");
}

function removeTask() {
  console.log("Goodbye World\n");
}

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
      <div class="options">
        <button class="left-button button">Sort</button>
        <button class="left-button button">Filter</button>
      </div>
      <div class="add-task">
        <button popovertarget="my-popover" class="right-button button">
          Add Task
        </button>

        <div id="my-popover" popover="manual">
          <button
            class="close-button"
            popovertarget="my-popover"
            popovertargetaction="hide"
            type="button"
            aria-label="Close alert"
          >
            <span aria-hidden="true">❌</span>
          </button>
          <form method="post">
            <ul>
              <li>
                <label for="name">Name:</label><br />
                <input type="text" id="name" name="name" /><br />
              </li>
              <li>
                <label for="desc">Description:</label><br />
                <textarea id="desc" name="user_message"></textarea><br />
              </li>
              <li>
                <label for="date">Due Date:</label><br />
                <input
                  type="date"
                  id="date"
                  aria-describedby="date-format"
                  min="2020-01-01"
                  max="2030-01-01"
                /><br />
              </li>
              <li>
                <label for="priority">Priority:</label><br />
                <select id="priority">
                  <option label="--Select One--"></option>
                  <option label="Low Priority"></option>
                  <option label="Medium Priority"></option>
                  <option label="High Priority"></option></select
                ><br />
              </li>
              <li>
                <label for="status">Status:</label><br />
                <select id="status">
                  <option label="--Select One--"></option>
                  <option label="Not Started"></option>
                  <option label="Started"></option>
                  <option label="Done"></option></select
                ><br />
              </li>
              <li>
                <input type="submit" value="Submit" />
              </li>
            </ul>
          </form>
        </div>
      </div>
      <div class="task-row border">
        <div class="header">Name</div>
        <div class="header">Assigned</div>
        <div class="header">Due Date</div>
        <div class="header">Task Priority</div>
        <div class="header">Task Status</div>
      </div>
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
