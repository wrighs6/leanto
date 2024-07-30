import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";

export default function TeamForm({ refresh }) {
  const handleSubmit = async event => {
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

    try {
      const response = await fetch(`https://api.${window.location.host}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json,
      });
      const result = await response.json();
    } catch (error) {
      console.error(error);
    }

    document.getElementById("add-team").hidePopover();
    setTimeout(refresh, 1000);
  };

  return html`
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
  `;
}
