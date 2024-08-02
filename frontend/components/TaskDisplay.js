import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";

export default function TaskDisplay({tasks, selected}) {
  const getTasks = (selected, tasks) => {
    // get all of the tasks from all of the team for the user
    if (selected == "") {
      const allTasks = tasks.map(
        (task) =>
          html`<div class="task-row border">
            <div class="section">${task.name}</div>
            <div class="section">${task.assignedTo}</div>
            <div class="section">${task.dueDate}</div>
            <div class="section">${task.priority}</div>
            <div class="status">${task.status}</div>
          </div>`,
      );
      return allTasks;
    }
    // get all of the tasks for the specified state, i.e. Team 1
    else {
      const teamTasks = tasks.map((task) => {
        if (task.team.id == selected) {
          return html`<div class="task-row border">
            <div class="section">${task.name}</div>
            <div class="section">${task.assignedTo}</div>
            <div class="section">${task.dueDate}</div>
            <div class="section">${task.priority}</div>
            <div class="status">${task.status}</div>
          </div>`;
        }
      });
      return teamTasks;
    }
  }
  
  return html`
    <div class="task-row border">
      <div class="header">Name</div>
      <div class="header">Assigned</div>
      <div class="header">Due Date</div>
      <div class="header">Task Priority</div>
      <div class="header">Task Status</div>
    </div>
    <div id="tasksContainer">${getTasks(selected, tasks)}</div>
  `;
}
