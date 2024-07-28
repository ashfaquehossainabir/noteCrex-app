/* ===========================================================
-- copyright 2024 (NoteCrex App)
-- Project Creator: Ashfaque Hossain Abir 
-- Github Id: https://github.com/ashfaquehossainabir 
-- Email: ashfaquehossain300@gmail.com
=========================================================== */


//========================================================================
//-- Username Popup Box
//========================================================================

const submitButton = document.querySelector('.submitBtn');
const userPopup = document.querySelector('.user-popup');
const overlay = document.getElementById('overlay');
const closeButton = document.querySelector("#close");

closeButton.addEventListener("click", function() {
  overlay.style.display = "none";
  userPopup.style.display = "none";
});

// After Submission User popup will close
submitButton.addEventListener('click', () => {
  userPopup.style.display = 'none';
  overlay.style.display = 'none';
});

function submit() {
    const userInput = document.getElementById("input").value;
    const displayUsername = document.getElementById("username");

    displayUsername.textContent = userInput.charAt(0).toUpperCase() + userInput.slice(1);
    localStorage.setItem("name", userInput);
}

window.onload = function() {
    const displayUsername = document.getElementById("username");
    const userPopup = document.querySelector('.user-popup');
    const overlay = document.getElementById('overlay');
    var storedData = localStorage.getItem("name");

    if(storedData) {
        displayUsername.textContent = storedData.charAt(0).toUpperCase() + storedData.slice(1);
        overlay.style.display = "none";
        userPopup.style.display = "none";
    } else {
        overlay.style.display = "block";
        userPopup.style.display = "block";
    }
}


//========================================================================
//-- Notes Creation Functionalities
//========================================================================


const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

function showNotes() {
    if(!notes) return;
    document.querySelectorAll(".note").forEach(li => li.remove());
    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
showNotes();

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if(!confirmDel) return;
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
    description = descTag.value.trim();

    if(title || description) {
        let currentDate = new Date(),
        month = months[currentDate.getMonth()],
        day = currentDate.getDate(),
        year = currentDate.getFullYear();

        let noteInfo = {title, description, date: `${month} ${day}, ${year}`}
        if(!isUpdate) {
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closeIcon.click();
    }
});


//========================================================================
//-- Disabling Context Menu & Some Keys
//========================================================================

//-------------- For prevent hacking -----------------

// Disable context menu
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
}, false);
  
// Disable “Ctrl+Shift+I”, “Ctrl+U” and ”F12 key
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.keyCode==123) {
        e.stopPropagation();
        e.preventDefault();
    }
});