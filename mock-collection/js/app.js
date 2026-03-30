const ballotData = {
  question1: "",
  question2: []
};

// Navigation
function goTo(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

// Start voting with ID check
function startVoting() {
  const idInput = document.getElementById("voter-id").value.trim();
  const error = document.getElementById("id-error");

  if (!idInput) {
    error.innerText = "Please enter your Voter ID.";
    error.style.display = "block";
    return;
  }

  let usedIDs = JSON.parse(localStorage.getItem("usedIDs")) || [];

  if (usedIDs.includes(idInput)) {
    error.innerText = "This Voter ID has already been used.";
    error.style.display = "block";
    return;
  }
  localStorage.setItem("currentVoterID", idInput); // Saves ID for the session
  goTo("ballot");
}

// Save selections and validate
function saveBallot() {
  const error = document.getElementById("error-message");
  const q1 = document.querySelector('input[name="q1"]:checked');
  const q2 = document.querySelectorAll('input[name="q2"]:checked');

  if (!q1) {
    error.innerText = "Please select an option for Question 1.";
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
  ballotData.question2 = Array.from(q2).map(el => el.value);

  showReview();
  goTo("review");
}

// Populate the review screen
function showReview() {
  document.getElementById("review-q1").innerText = "Question 1 Selection: " + ballotData.question1;
  document.getElementById("review-q2").innerText = "Question 2 Selections: " + ballotData.question2.join(", ");
}

// Final submission
function submitBallot() {
  const ballotId = "HELIOS-" + Math.floor(Math.random() * 1000000);
  const voterID = localStorage.getItem("currentVoterID");
  
  // Save ID as used
  let usedIDs = JSON.parse(localStorage.getItem("usedIDs")) || [];
  usedIDs.push(voterID);
  localStorage.setItem("usedIDs", JSON.stringify(usedIDs));

  document.getElementById("confirmation").innerHTML = 
    "<strong>Success!</strong> Your anonymous vote has been recorded.<br>Receipt ID: " + ballotId;
  
  goTo("submission");
}
