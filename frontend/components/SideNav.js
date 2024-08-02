import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";
import TeamForm from "./TeamForm.js";

export default function SideNav(props) {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(async () => {
    // fetch the teams
    const teamResponse = await fetch(`https://api.${window.location.host}/teams`);
    const teams = await teamResponse.json();

    // fetch the users
    const userResponse = await fetch(`https://api.${window.location.host}/users`);
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
  }, [refresh]);

  return html`
    <${TeamForm} open=${formOpen} close=${() => setFormOpen(false)} refresh=${() => setRefresh(!refresh)} />
    <nav>
      <ul>
        <li>
          <button id="myTasks" onClick=${() => props.update("")}>
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
            <button onClick=${() => setFormOpen(true)}>Add Team</button>
          </div>
        </li>
        <li><button>Settings</button></li>
        <li><button>Logout</button></li>
      </ul>
    </nav>
  `;
}
