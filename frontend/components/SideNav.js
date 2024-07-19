import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";

async function postJSON(data) {
  try {
    const response = await fetch(`https://api.${window.location.host}/teams`, {
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
  for (let [key, value] of data) {
    // members are arrays
    if (key == "members" && value != "") {
      object[key] = data.getAll("members");
    }
    // name is a key-value pair
    else {
      object[key] = value;
    }
  }
  var json = JSON.stringify(object);
  postJSON(json);
}

export default function SideNav(props) {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(async () => {
    // fetch the teams
    const teamResponse = await fetch(
      `https://api.${window.location.host}/teams`,
    );
    const teams = await teamResponse.json();

    // fetch the users
    const userResponse = await fetch(
      `https://api.${window.location.host}/users`,
    );
    const users = await userResponse.json();

    // If there is no tasks, the 'My Tasks' button will not appear.
    if (teams == null) {
      return html`
        <nav>
          <ul>
            <li><button>Settings</button></li>
            <li><button>Logout</button></li>
          </ul>
        </nav>
      `;
    }
    setTeams(teams);
    setUsers(users);
    const form = document.querySelector("form");
    form.addEventListener("submit", handleSubmit);
  }, []);

  return html`
    <nav>
      <ul>
        <li>
          <button id="myTasks" onClick=${() => props.update(8189)}>
            My Tasks
          </button>
        </li>
        <li><hr /></li>
        ${teams.map(
          (team) =>
            html`<li>
              <button onClick=${() => props.update(team.id)}>
                ${team.name}
              </button>
            </li>`,
        )}
        <li><hr /></li>
        <li>
          <div>
            <button popovertarget="add-team">Add Team</button>

            <div id="add-team" popover="manual">
              <button
                class="close-button"
                popovertarget="add-team"
                popovertargetaction="hide"
                type="button"
                aria-label="Close alert"
              >
                <span aria-hidden="true">❌</span>
              </button>
              <form method="post">
                <ul class="add-team">
                  <li class="add-team">
                    <label for="name">Name:</label><br class="extra-margin" />
                    <input type="text" id="name" name="name" /><br />
                  </li>
                  <li class="add-team">
                    <label for="members">Members:</label
                    ><br class="extra-margin" />
                    <select name="members" id="members">
                      <option value="volvo">Volvo</option>
                      <option value="saab">Saab</option>
                      <option value="mercedes">Mercedes</option>
                      <option value="audi">Audi</option>
                    </select>
                  </li>
                  <li>
                    <input
                      type="submit"
                      value="Add"
                      popovertargetaction="hide"
                    />
                  </li>
                </ul>
              </form>
            </div>
          </div>
        </li>
        <li><button>Settings</button></li>
        <li><button>Logout</button></li>
      </ul>
    </nav>
  `;
}
