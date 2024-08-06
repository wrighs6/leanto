import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";
import TaskForm from "./TaskForm.js";
import TaskDisplay from "./TaskDisplay.js";

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
    location.reload();
  } catch (error) {
    console.error("Error:", error);
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

  const handleSubmit = (typeOfRequest) => (event) => {
    if (typeOfRequest == "DELETE") {
      event.preventDefault();
      deleteTeam(this.props.selected);
      document.getElementById("delete-team").hidePopover();
    }
  };

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
        ${(() => {
          if (selected != "") {
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
      </div>
      <${TaskForm} open=${formOpen} close=${() => setFormOpen(false)} refresh=${() => setRefresh(!refresh)} selected=${selected} />
      <${TaskDisplay} tasks=${tasks} selected=${selected} />
    </main>
  `;
}
