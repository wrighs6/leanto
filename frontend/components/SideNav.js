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
        <li><button>Settings</button></li>
        <li><button>Logout</button></li>
      </ul>
    </nav>
  `;
}
