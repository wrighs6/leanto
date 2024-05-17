import { html } from 'htm/preact';

export function Header({ teams }) {
  return html`
    <header>
      <select>
        ${teams.map(t => (
          html`<option>${t}</option>`
        ))}
      </select>
    </header>
  `;
}
