import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showStudents } from "./students.js";

let addEditDiv = null;
let studentName = null;
let educationLevel = null;
let age = null;
let addingStudent = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-student");
  studentName = document.getElementById("studentName");
  age = document.getElementById("age");
  educationLevel = document.getElementById("educationLevel"); 
  addingStudent = document.getElementById("adding-student");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
        if (e.target === addingStudent) {
            enableInput(false);

            let method = "POST";
            let url = "/api/v1/students/";

            if (addingStudent.textContent === "update") {
                method = "PATCH";
                url = `/api/v1/students/${addEditDiv.dataset.id}`;
            }

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        studentName: studentName.value,
                        age: age.value,
                        educationLevel: educationLevel.value,
                    }),
                });

                const data = await response.json();
                if (response.status === 200 || response.status === 201) {
                    if (response.status === 200) {
                        message.textContent = "The student entry was updated.";
                    } else {
                        message.textContent = "The student entry was created.";
                    }

                    studentName.value = "";
                    age.value = "";
                    educationLevel.value = "";

                    showStudents();
                } else {
                    message.textContent = data.msg;
                }
            } catch (err) {
                console.log(err);
                message.textContent = "A communication error occurred.";
            }

            enableInput(true);
        } else if (e.target === editCancel) {
            message.textContent = "";
            showStudents();
        }
    }
});
};

export const showAddEdit = async (studentId) => {
if (!studentId) {
    studentName.value = "";
    age.value = "";
    educationLevel.value = "";
    addingStudent.textContent = "Add";
    message.textContent = "";

    setDiv(addEditDiv);
} else {
    enableInput(false);

    try {
        const response = await fetch(`/api/v1/students/${studentId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        });

        const data = await response.json();
        if (response.status === 200) {
            studentName.value = data.student.studentName;
            age.value = data.student.age;
            educationLevel.value = data.student.educationLevel;
            addingStudent.textContent = "update";
            message.textContent = "";
            addEditDiv.dataset.id = studentId;

            setDiv(addEditDiv);
        } else {
            message.textContent = "The students entry was not found";
            showStudents();
        }
    } catch (err) {
        console.log(err);
        message.textContent = "A communications error has occurred.";
        showStudents();
    }

    enableInput(true);
}
};

export const deleteStudent = async (studentId) => {
enableInput(false);
try {
    const response = await fetch(`/api/v1/students/${studentId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 200) {
        message.textContent = "Student successfully deleted.";
        showStudents();
    } else {
        const data = await response.json();
        message.textContent = data.msg;
    }
} catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred while deleting the student.";
}

enableInput(true);
};