import { render } from 'preact';
import { html } from 'htm/preact';
import SideNav from './components/SideNav.js';
import TeamMain from './components/TeamMain.js';

function App() {

  return html`
    <div class="app">
      <${SideNav} />
      <${TeamMain} />
    </div>
  `;
}

render(html`<${App} />`, document.body);
