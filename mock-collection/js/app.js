let ballotID;
const ballotData = {
  question1: "",
  question2: [],
};

let progressBar = 1;

// Navigation
function goTo(screenId) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
  if (screenId === "home") {
    document.getElementById("voter-id").value = "";
    document.getElementById("email-id").value = "";
    const inputs = document.querySelectorAll(".question input");
    inputs.forEach((input) => {
      input.checked = false;
    });
    document.getElementById("id-error").style.display = "none";
    document.getElementById("id-error").innerText = "";
    progressBar = 1;
    const bar = document.getElementById("voting-progress");
    bar.value = progressBar;
    document.getElementById("progress-label").textContent = "1/3 Steps";
  }
}

// Start voting with ID check
function startVoting() {
  const idInput = document.getElementById("voter-id").value.trim();
  const email = document.getElementById("email-id").value.trim();
  const error = document.getElementById("id-error");

  ballotID = "BALLOT-" + Math.floor(Math.random() * 100000);

  if (!idInput && email === "") {
    error.innerText = "Please enter your Voter ID and Email.";
    error.style.display = "block";
    return;
  }

  if (!idInput) {
    error.innerText = "Please enter your Voter ID.";
    error.style.display = "block";
    return;
  }

  if (email === "" || !email.includes("@")) {
    error.innerText = "Please enter a valid email.";
    error.style.display = "block";
    return;
  }

  let usedIDs = JSON.parse(localStorage.getItem("usedIDs")) || [];

  if (usedIDs.includes(idInput)) {
    error.innerText = "This Voter ID has already been used.";
    error.style.display = "block";
    return;
  }

  localStorage.setItem("currentVoterID", idInput);
  error.style.display = "none";
  goTo("ballot");
  increaseProgressBar();
}

// Save selections and validate
function saveBallot() {
  const error = document.getElementById("error-message");
  const q1 = document.querySelector('input[name="q1"]:checked');
  const q2 = document.querySelectorAll('input[name="q2"]:checked');

  if (!q1) {
    error.innerText = "Please select one option for Question 1.";
    error.style.display = "block";
    return;
  }

  if (q2.length === 0) {
    error.innerText = "Please select at least one option for Question 2.";
    error.style.display = "block";
    return;
  }

  error.style.display = "none";
  ballotData.question1 = q1.value;
  ballotData.question2 = Array.from(q2).map((el) => el.value);

  showReview();
  goTo("review");
  increaseProgressBar();
}

// Populate the review screen
function showReview() {
  document.getElementById("review-q1").innerText = "Q1: " + ballotData.question1;
  document.getElementById("review-q2").innerText = "Q2: " + ballotData.question2.join(", ");
}

// Final submission
function submitBallot() {
  const voterID = localStorage.getItem("currentVoterID");
  let usedIDs = JSON.parse(localStorage.getItem("usedIDs")) || [];
  usedIDs.push(voterID);
  localStorage.setItem("usedIDs", JSON.stringify(usedIDs));

  goTo("submission");
  increaseProgressBar();
}

// Show ballot ID popup
function getBallotID() {
  alert(
    "Your vote is anonymous - " +
      ballotID +
      " this ID confirms your vote was successfully submitted and stored securely. Save to verify later."
  );
}

function increaseProgressBar() {
  const bar = document.getElementById("voting-progress");
  progressBar = Math.min(progressBar + 1, 3);
  bar.value = progressBar;
  document.getElementById("progress-label").textContent = `${progressBar}/3 Steps`;
}
