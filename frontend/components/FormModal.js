import { html } from "htm/preact";
import { useEffect, useRef } from "preact/hooks";

export default function FormModal({ open, close, onSubmit, children }) {
  const ref = useRef();

  useEffect(() => {
    if (open) {
      ref.current.showModal();
    } else {
      ref.current.close();
    }
  }, [open]);

  return html `
    <dialog ref=${ref} onClose=${close}>
      <form onSubmit=${onSubmit}>
        ${children}
      </form>
    </dialog>
  `;
}
