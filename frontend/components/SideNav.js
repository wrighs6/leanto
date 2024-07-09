import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";
import TeamMain from "./TeamMain.js";

export default function SideNav() {
  const [teams, setTeams] = useState([]);

  useEffect(async () => {
    const response = await fetch(`https://api.${window.location.host}/teams`);
    const data = await response.json();
    // there are no current teams with the user
    if (data == null) {
      return html`
        <nav>
          <ul>
            <li><button>My Tasks</button></li>
            <li><button>Settings</button></li>
            <li><button>Logout</button></li>
          </ul>
        </nav>
      `;
    }
    setTeams(data);
  }, []);

  // show all of the teams that the user is in
  return html`
    <nav>
      <ul>
        <li>
          <script
            type="text/javascript"
            type="module"
            src="./components/TeamMain.js"
          ></script>
          <button id="myTasks">My Tasks</button>
          <script type="text/javascript">
            var button = document.getElementById("myTasks");

            button.onclick = function () {
              <iframe
                src=TeamMain()
                name="targetframe"
                allowTransparency="false"
                scrolling="no"
                frameborder="0"
              ></iframe>;
              console.log("hello")
            };
          </script>
        </li>
        <li><hr /></li>
        ${teams.map((team) => html`<li><button>${team.name}</button></li>`)}
        <li><hr /></li>
        <li><button>Settings</button></li>
        <li><button>Logout</button></li>
      </ul>
    </nav>
  `;
}
