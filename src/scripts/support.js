"use strict";

emailjs.init("user_evsJFjdJdL40vVeI8o171");

function sendEmail() {
    setInputErrorMessage("", "support");
    setInputErrorMessage("", "name");
    setInputErrorMessage("", "subject");
    setInputErrorMessage("", "text");
    const currentUser = getCurrentUser();
    const buttonEl = document.getElementById("email-button");
    if (currentUser.sentEmails >= 3) {
        setInputErrorMessage("You reached email limit", "support");
        buttonEl.disabled = true;
        return false;
    }
    const nameEl = document.getElementById("name");
    const subjectEl = document.getElementById("subject");
    const textEl = document.getElementById("text");
    if (!nameEl.value) {
        setInputErrorMessage("Name is required", "name");
    }
    if (!subjectEl.value) {
        setInputErrorMessage("Subject is required", "subject");
    }
    if (!textEl.value) {
        setInputErrorMessage("Text is required", "text");
    }
    if (!nameEl.value || !subjectEl.value || !textEl.value) {
        return false;
    }
    buttonEl.innerText = "Loading...";
    buttonEl.disabled = true;
    emailjs.send("service_obv1kbe", "template_67aykrp", {
        from_name: nameEl.value,
        subject: subjectEl.value,
        message: textEl.value
    })
        .then(() => {
            if (currentUser.sentEmails) {
                currentUser.sentEmails++;
            } else {
                currentUser.sentEmails = 1;
            }
            updateUser({ sentEmails: currentUser.sentEmails });
            nameEl.value = "";
            subjectEl.value = "";
            textEl.value = "";
            buttonEl.disabled = false;
            buttonEl.innerText = "Send";
        }).catch(() => {
            buttonEl.disabled = false;
            buttonEl.innerText = "Send";
            setInputErrorMessage("Error trying to send email", "support");
        });
    return false;
}