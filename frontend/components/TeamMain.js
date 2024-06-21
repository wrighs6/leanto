import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";

async function postJSON(data) {
  try {
    const response = await fetch(`https://api.${window.location.host}/tasks`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}


async function handleSubmit(event) {
  event.preventDefault();

  const data = new FormData(event.target);

  var object = {};
  data.forEach((value, key) => (object[key] = value));
  var json = JSON.stringify(object);
  postJSON(json);
}

export default function TeamMain() {
  const [tasks, setTasks] = useState([]);

  useEffect(async () => {
    const response = await fetch(`https://api.${window.location.host}/tasks`);
    const data = await response.json();
    setTasks(data);
    console.log(data);
    const form = document.querySelector("form");
    form.addEventListener("submit", handleSubmit);
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
                <label for="Name">Name:</label><br />
                <input type="text" id="Name" name="Name" /><br />
              </li>
              <li>
                <label for="Description">Description:</label><br />
                <textarea id="Description" name="Description"></textarea><br />
              </li>
              <li>
                <label for="DueDate">Due Date:</label><br />
                <input
                  type="date"
                  name="DueDate"
                  id="DueDate"
                  aria-describedby="date-format"
                  min="2020-01-01"
                  max="2030-01-01"
                /><br />
              </li>
              <li>
                <label for="AssignedTo">Assigned To:</label><br />
                <input type="text" id="AssignedTo" name="AssignedTo" /><br />
              </li>
              <li>
                <label for="Priority">Priority:</label><br />
                <select id="Priority" name="Priority">
                  <option label="--Select One--"></option>
                  <option label="Low Priority"></option>
                  <option label="Medium Priority"></option>
                  <option label="High Priority"></option></select
                ><br />
              </li>
              <li>
                <label for="Status">Status:</label><br />
                <select id="Status" name="Status">
                  <option label="--Select One--"></option>
                  <option label="Not Started"></option>
                  <option label="Started"></option>
                  <option label="Done"></option></select
                ><br />
              </li>
              <li>
                <input type="submit" value="Add" popovertargetaction="hide" />
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
