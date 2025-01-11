document.getElementById("issueInputForm").addEventListener("submit", saveIssue);

function toggleTheme() {
  const body = document.body;
  const themeIcon = document.querySelector(".theme-switch i");
  const themeText = document.querySelector(".theme-text");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    themeIcon.classList.remove("bi-moon-stars-fill");
    themeIcon.classList.add("bi-sun-fill");
    themeText.textContent = "Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    themeIcon.classList.remove("bi-sun-fill");
    themeIcon.classList.add("bi-moon-stars-fill");
    themeText.textContent = "Dark Mode";
    localStorage.setItem("theme", "light");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    const themeIcon = document.querySelector(".theme-switch i");
    const themeText = document.querySelector(".theme-text");
    themeIcon.classList.remove("bi-moon-stars-fill");
    themeIcon.classList.add("bi-sun-fill");
    themeText.textContent = "Light Mode";
  }
});

function saveIssue(e) {
  e.preventDefault(); // Sayfanın yenilenmesini engelle
  var issueDesc = document.getElementById("issueDescInput").value;
  var issueSeverity = document.getElementById("IssueSeverityInput").value;
  var issueAssignedTo = document.getElementById("issueAssignedToInput").value;
  var issueId =
    Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  var issuesStatus = "open";

  var issue = {
    id: issueId,
    description: issueDesc,
    severity: issueSeverity,
    assignedTo: issueAssignedTo,
    status: issuesStatus,
  };

  if (localStorage.getItem("issues") === null) {
    var issues = [];
    issues.push(issue);
    localStorage.setItem("issues", JSON.stringify(issues));
  } else {
    var issues = JSON.parse(localStorage.getItem("issues"));
    issues.push(issue);
    localStorage.setItem("issues", JSON.stringify(issues));
  }

  document.getElementById("issueInputForm").reset(); // Formu sıfırla

  fetchIssues(); // Yeni eklenen veriyi listele

  e.preventDefault();
}

function setStatusClosed(id) {
  console.log("Close button clicked for ID: " + id); // Tetikleme testi için eklenmiş log

  var issues = JSON.parse(localStorage.getItem("issues"));

  for (var i = 0; i < issues.length; i++) {
    if (issues[i].id == id) {
      issues[i].status = "Closed"; // Durumu güncelliyoruz
    }
  }

  localStorage.setItem("issues", JSON.stringify(issues)); // Güncellenmiş veriyi kaydediyoruz

  fetchIssues(); // Güncellenmiş listeyi tekrar yükleyelim
}

function deleteIssue(id) {
  var issues = JSON.parse(localStorage.getItem("issues")); // 'JSON.parse' doğru yazıldı

  for (var i = 0; i < issues.length; i++) {
    if (issues[i].id == id) {
      issues.splice(i, 1);
    }
  }

  localStorage.setItem("issues", JSON.stringify(issues)); // Güncellenmiş veriyi localStorage'a kaydet

  fetchIssues(); // Güncellenmiş listeyi tekrar çek
}

function fetchIssues() {
  var issues = JSON.parse(localStorage.getItem("issues")) || [];
  var issuesList = document.getElementById("issuesList");

  issuesList.innerHTML = "";

  for (var i = 0; i < issues.length; i++) {
    var id = issues[i].id;
    var desc = issues[i].description;
    var severity = issues[i].severity;
    var assignedTo = issues[i].assignedTo;
    var status = issues[i].status;

    // Severity'ye göre badge rengi belirleme
    let severityClass = "";
    switch (severity.toLowerCase()) {
      case "low":
        severityClass = "bg-info";
        break;
      case "medium":
        severityClass = "bg-warning";
        break;
      case "high":
        severityClass = "bg-danger";
        break;
      default:
        severityClass = "bg-secondary";
    }

    // Status badge'i için renk belirleme
    let statusClass = status === "Closed" ? "bg-success" : "bg-primary";

    issuesList.innerHTML += `
      <div class="card shadow-sm mb-4">
        <div class="card-header d-flex justify-content-between align-items-center" 
             style="background: rgba(255, 255, 255, 0.8)">
          <small class="text-muted">ID: ${id}</small>
          <span class="badge ${statusClass}">${status}</span>
        </div>
        <div class="card-body">
          <h5 class="card-title mb-3">${desc}</h5>
          <div class="mb-3 d-flex gap-2">
            <span class="badge ${severityClass} d-flex align-items-center">
              <i class="bi bi-exclamation-triangle me-1"></i>${severity}
            </span>
            <span class="badge bg-secondary d-flex align-items-center">
              <i class="bi bi-person-fill me-1"></i>${assignedTo}
            </span>
          </div>
          <div class="d-flex gap-2">
            <button onclick="setStatusClosed('${id}')" 
                    class="btn btn-outline-warning btn-sm d-flex align-items-center">
              <i class="bi bi-check2-circle me-1"></i>Close
            </button>
            <button onclick="deleteIssue('${id}')" 
                    class="btn btn-outline-danger btn-sm d-flex align-items-center">
              <i class="bi bi-trash me-1"></i>Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
