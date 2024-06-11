import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";

export default function SideNav() {
  const [teams, setTeams] = useState([]);

  useEffect(async () => {
    const response = await fetch(`https://api.${window.location.host}/teams`);
    const data = await response.json();
    setTeams(data);
  }, []);

  return html`
    <nav>
      <ul>
        <li><button>My Tasks</button></li>
        <li><hr /></li>
        ${teams.map((team) => html`<li><button>${team.name}</button></li>`)}
        <li><hr /></li>
        <li><button>Settings</button></li>
        <li><button>Logout</button></li>
      </ul>
    </nav>
  `;
}
