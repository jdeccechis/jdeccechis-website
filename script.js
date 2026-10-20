// Small enhancements only. Every page still works with JavaScript turned off.

// Footer: current year and the page's last-modified date.
document.querySelectorAll(".year").forEach(function (el) {
  el.textContent = new Date().getFullYear();
});
var updated = document.getElementById("updated");
if (updated) {
  updated.textContent = new Date(document.lastModified).toISOString().slice(0, 10);
}

// Projects page: list public GitHub repos (newest activity first).
var repoList = document.getElementById("repos");
if (repoList) {
  var user = repoList.getAttribute("data-github-user");
  fetch("https://api.github.com/users/" + user + "/repos?sort=pushed&per_page=30")
    .then(function (res) {
      if (!res.ok) throw new Error("GitHub returned " + res.status);
      return res.json();
    })
    .then(function (repos) {
      repos = repos.filter(function (r) { return !r.fork; });
      if (repos.length === 0) return;
      repoList.innerHTML = "";
      repos.forEach(function (r) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = r.html_url;
        a.textContent = r.name;
        li.appendChild(a);
        if (r.description) li.appendChild(document.createTextNode(" – " + r.description));
        if (r.language) {
          var badge = document.createElement("span");
          badge.className = "badge";
          badge.textContent = r.language;
          li.appendChild(document.createTextNode(" "));
          li.appendChild(badge);
        }
        repoList.appendChild(li);
      });
    })
    .catch(function () { /* keep the fallback link */ });
}
