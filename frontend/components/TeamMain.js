import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";

async function postJSON(data) {
  try {
    const response = await fetch(`https://api.${window.location.host}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

function handleSubmit(event) {
  event.preventDefault();

  const data = new FormData(event.target);

  var object = {};
  //data.forEach((value, key) => (object[key] = value));
  for (let [key, value] of data) {
    // convert Date() types properly
    if (key == "dueDate" && value != "") {
      object[key] = new Date(value);
    }
    // add field if not empty
    else if (key != "dueDate" && value != "") {
      // special case for assignedTo as it is a list
      if (key == "assignedTo") {
        object[key] = data.getAll("assignedTo");
      } else {
        object[key] = value;
      }
    }
  }
  var json = JSON.stringify(object);
  postJSON(json);
  document.getElementById("my-popover").hidePopover();
}

function getTasks(props, tasks) {
  // get all of the tasks from all of the team for the user
  if (props.taskState == 8189) {
     const allTasks = tasks.map(
           (task) => 
              html`<div class="task-row border">
                <div class="section">${task.name}</div>
                <div class="section">${task.assignedTo}</div>
                <div class="section">${task.dueDate}</div>
                <div class="section">${task.priority}</div>
                <div class="status">${task.status}</div>
              </div>`);
   return allTasks;
  }
  // get all of the tasks for the specified state, i.e. Team 1
  else {
     const teamTasks = tasks.map(
           (task) => {
             if (task.team.id == props.taskState) {
              return html`<div class="task-row border">
                <div class="section">${task.name}</div>
                <div class="section">${task.assignedTo}</div>
                <div class="section">${task.dueDate}</div>
                <div class="section">${task.priority}</div>
                <div class="status">${task.status}</div>
              </div>`}});
   return teamTasks;

  }
}


export default function TeamMain(props) {
  const [tasks, setTasks] = useState([]);

  useEffect(async () => {
    const response = await fetch(`https://api.${window.location.host}/tasks`);
    const data = await response.json();
    setTasks(data);
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
                <label for="name">Name:</label><br />
                <input type="text" id="name" name="name" /><br />
              </li>
              <li>
                <label for="description">Description:</label><br />
                <textarea id="description" name="description"></textarea><br />
              </li>
              <li>
                <label for="dueDate">Due Date:</label><br />
                <input
                  type="date"
                  name="dueDate"
                  id="DueDate"
                  aria-describedby="date-format"
                  min="2020-01-01"
                  max="2030-01-01"
                /><br />
              </li>
              <li>
                <label for="assignedTo">Assigned To:</label><br />
                <input type="text" id="assignedTo" name="assignedTo" /><br />
              </li>
              <li>
                <label for="priority">Priority:</label><br />
                <select id="priority" name="priority">
                  <option label="--Select One--"></option>
                  <option>Low Priority</option>
                  <option>Medium Priority</option>
                  <option>High Priority</option></select
                ><br />
              </li>
              <li>
                <label for="status">Status:</label><br />
                <select id="status" name="status">
                  <option label="--Select One--"></option>
                  <option>Not Started</option>
                  <option>Started</option>
                  <option>Done</option></select
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
      <div id="tasksContainer">
        ${getTasks(props, tasks)}
      </div>
    </main>
  `;
}
