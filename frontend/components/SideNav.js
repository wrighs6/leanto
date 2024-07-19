import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";

export default function SideNav(props) {
  const [teams, setTeams] = useState([]);

  useEffect(async () => {
    const response = await fetch(`https://api.${window.location.host}/teams`);
    const data = await response.json();
    // If there is no tasks, the 'My Tasks' button will not appear.
    if (data == null) {
      return html`
        <nav>
          <ul>
            <li><button>Settings</button></li>
            <li><button>Logout</button></li>
          </ul>
        </nav>
      `;
    }
    setTeams(data);
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
                    <label for="name">Name:</label><br />
                    <input type="text" id="name" name="name" /><br />
                  </li>
                  <li class="add-team">
                    <label for="searchMember">Add member:</label><br />
                    <input
                      type="search"
                      id="searchMember"
                      name="searchMember"
                    /><br />
                    <input type="submit" value="Add" /><br />
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
