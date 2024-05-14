import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";
import { deleteStudent } from "./addEdit.js";

let studentsDiv = null;
let studentsTable = null;
let studentsTableHeader = null;

export const handleStudents = () => {
  studentsDiv = document.getElementById("students");
  const logoff = document.getElementById("logoff");
  const addStudent = document.getElementById("add-student");
  studentsTable = document.getElementById("students-table");
  studentsTableHeader = document.getElementById("students-table-header");

  studentsDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addStudent) {
        showAddEdit(null);
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        message.textContent = "";
        deleteStudent(e.target.dataset.id);
      } else if (e.target === logoff) {
        setToken(null);
        message.textContent = "You have been logged off.";
        studentsTable.replaceChildren([studentsTableHeader]);
        showLoginRegister();
      }
    }
  });
};

export const showStudents = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/students", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [studentsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        studentsTable.replaceChildren(...children);
      } else {
        for (let i = 0; i < data.students.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton" data-id=${data.students[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.students[i]._id}>delete</button></td>`;

          let rowHTML = `
            <td>${data.students[i].name}</td>
            <td>${data.students[i].age}</td>
            <div>${educationLevel}</div>
            <div>${editButton}${deleteButton}</div>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        studentsTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(studentsDiv);
};
