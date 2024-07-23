import { render } from "preact";
import { html } from "htm/preact";
import { useState } from "preact/hooks";
import SideNav from "./components/SideNav.js";
import TeamMain from "./components/TeamMain.js";

function App() {
  const [state, setState] = useState("");

  return html`
    <div class="app">
      <${SideNav} update=${setState} />
      <${TeamMain} taskState=${state} />
    </div>
  `;
}

render(html`<${App} />`, document.body);
