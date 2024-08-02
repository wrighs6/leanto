import { render } from "preact";
import { html } from "htm/preact";
import { useState } from "preact/hooks";
import SideNav from "./components/SideNav.js";
import TeamMain from "./components/TeamMain.js";

function App() {
  const [selected, setSelected] = useState("");

  return html`
    <div class="app">
      <${SideNav} update=${setSelected} />
      <${TeamMain} selected=${selected} />
    </div>
  `;
}

render(html`<${App} />`, document.body);
