import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";

async function teamPostJSON(data) {
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

export default function SideNav(props) {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);

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
  }, [refresh]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.target);

    var object = {};
    for (let [key, value] of data) {
      // members are arrays
      if (key == "members" && value != "") {
        console.log(value);
        object[key] = data.getAll("members");
      }
      // name is a key-value pair
      else {
        object[key] = value;
      }
    }
    var json = JSON.stringify(object);
    teamPostJSON(json);
    document.getElementById("add-team").hidePopover();
    setTimeout(() => setRefresh(!refresh), 1000);
  };

  return html`
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
              <form onSubmit=${handleSubmit}>
                <ul class="add-team">
                  <li class="add-team">
                    <label for="name">Name:</label><br class="extra-margin" />
                    <input type="text" id="name" name="name" /><br />
                  </li>
                  <li class="add-team">
                    <label for="members">Members:</label
                    ><br class="extra-margin" />
                    <div
                      id="members"
                      class="dropdown-check-list"
                      tabindex="100"
                    >
                      <span class="anchor">Select Fruits</span>
                      <ul class="items">
                        <li><input type="checkbox" />Apple</li>
                        <li><input type="checkbox" />Orange</li>
                        <li><input type="checkbox" />Grapes</li>
                        <li><input type="checkbox" />Berry</li>
                        <li><input type="checkbox" />Mango</li>
                        <li><input type="checkbox" />Banana</li>
                        <li><input type="checkbox" />Tomato</li>
                      </ul>
                    </div>
                    <script>
                      var checkList = document.getElementById("members");
                      checkList.getElementsByClassName("anchor")[0].onclick =
                        function (evt) {
                          if (checkList.classList.contains("visible"))
                            checkList.classList.remove("visible");
                          else checkList.classList.add("visible");
                        };
                    </script>
                  </li>
                  <li>
                    <input
                      type="submit"
                      value="Add team"
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
