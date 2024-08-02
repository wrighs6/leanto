import { html } from "htm/preact";
import FormModal from "./FormModal.js";

export default function TaskForm({ open, close, refresh, selected }) {
  const handleSubmit = async event => {
    event.preventDefault();

    const data = new FormData(event.target);

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
    object.team = selected;

    var json = JSON.stringify(object);

    try {
      const response = await fetch(`https://api.${window.location.host}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: json,
      });
      const result = await response.json();
    } catch (error) {
      console.error(error);
    }

    close();
    setTimeout(refresh, 1000);
  };

  return html`
    <${FormModal} open=${open} close=${close} onSubmit=${handleSubmit}>
      <button
        class="close-button"
        onClick=${close}
        type="button"
        aria-label="Close alert"
      >
        <span aria-hidden="true">❌</span>
      </button>
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
          />
        </li>
      </ul>
    </${FormModal}>
  `;
}
