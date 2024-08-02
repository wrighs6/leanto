import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";

async function taskPostJSON(data) {
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

async function deleteTeam(teamId) {
  try {
    const response = await fetch(
      `https://api.${window.location.host}/teams/${teamId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

function getTasks(props, tasks) {
  // get all of the tasks from all of the team for the user
  if (props.taskState == "") {
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
      if (task.team.id == props.taskState) {
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

export default function TeamMain(props) {
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(async () => {
    const response = await fetch(`https://api.${window.location.host}/tasks`);
    const data = await response.json();
    setTasks(data);
  }, [refresh]);

  const handleSubmit = (typeOfRequest) => (event) => {
    event.preventDefault();

    const data = new FormData(event.target);

    // POST requests are done by adding teams
    if (typeOfRequest == "POST") {
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
      object.team = props.taskState;
      var json = JSON.stringify(object);
      taskPostJSON(json);
      document.getElementById("add-task").hidePopover();
    }
    // DELETE requests are done by deleting teams
    if (typeOfRequest == "DELETE") {
      deleteTeam(props.taskState);
      document.getElementById("delete-team").hidePopover();
    }
    setTimeout(() => setRefresh(!refresh), 1000);
  };

  return html`
    <main>
      <div class="options">
        <button class="left-button button">Sort</button>
        <button class="left-button button">Filter</button>
      </div>
      <div class="add-task">
        <button popovertarget="add-task" class="right-button button">
          Add Task
        </button>

        ${(() => {
          if (props.taskState != "") {
            return html`<button
                class="right-button button"
                popovertarget="delete-team"
              >
                Delete Team
              </button>
              <div id="delete-team" popover="manual">
                <button
                  class="close-button"
                  popovertarget="delete-team"
                  popovertargetaction="hide"
                  type="button"
                  aria-label="Close alert"
                >
                  <span aria-hidden="true">❌</span>
                </button>
                <form
                  onSubmit=${handleSubmit("DELETE")}
                  class="delete-team-form"
                >
                  <p>Confirm deleting team</p>
                  <input
                    type="submit"
                    value="Delete Team"
                    popovertargetaction="hide"
                  />
                </form>
              </div> `;
          }
        })()}

        <div id="add-task" popover="manual">
          <button
            class="close-button"
            popovertarget="add-task"
            popovertargetaction="hide"
            type="button"
            aria-label="Close alert"
          >
            <span aria-hidden="true">❌</span>
          </button>
          <form onSubmit=${handleSubmit("POST")}>
            <ul>
              <li>
                <label for="name">Name:</label><br class="extra-margin" />
                <input type="text" id="name" name="name" /><br />
              </li>
              <li>
                <label for="description">Description:</label
                ><br class="extra-margin" />
                <textarea id="description" name="description"></textarea><br />
              </li>
              <li>
                <label for="dueDate">Due Date:</label
                ><br class="extra-margin" />
                <input
                  type="datetime-local"
                  name="dueDate"
                  id="DueDate"
                  aria-describedby="date-format"
                /><br />
              </li>
              <li>
                <label for="assignedTo">Assigned To:</label
                ><br class="extra-margin" />
                <input type="text" id="assignedTo" name="assignedTo" /><br />
              </li>
              <li>
                <label for="priority">Priority:</label
                ><br class="extra-margin" />
                <select id="priority" name="priority">
                  <option label="--Select One--"></option>
                  <option>Low Priority</option>
                  <option>Medium Priority</option>
                  <option>High Priority</option></select
                ><br />
              </li>
              <li>
                <label for="status">Status:</label><br class="extra-margin" />
                <select id="status" name="status">
                  <option label="--Select One--"></option>
                  <option>Not Started</option>
                  <option>Started</option>
                  <option>Done</option></select
                ><br />
              </li>
              <li>
                <input
                  type="submit"
                  value="Add task"
                  popovertargetaction="hide"
                />
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
      <div id="tasksContainer">${getTasks(props, tasks)}</div>
    </main>
  `;
}
