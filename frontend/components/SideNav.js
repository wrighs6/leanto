import { html } from 'htm/preact';

export default function SideNav() {
  return html`
    <nav>
      <ul>
        <li><a href="#">My Tasks</a></li>
        <li><hr /></li>
        <li><a href="#">Team 1</a></li>
        <li><a href="#">Team 2</a></li>
        <li><a href="#">Team 3</a></li>
        <li><hr /></li>
        <li><a href="#">Settings</a></li>
        <li><a href="#">Logout</a></li>
      </ul>
    </nav>
  `;
}
