// --- 1. تتبع وقت البقاء في الصفحة ---
let startTime = Date.now();

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden") {
    const endTime = Date.now();
    const timeSpentInSeconds = Math.round((endTime - startTime) / 1000);

    if (timeSpentInSeconds > 3) {
      const timeData = {
        page: window.location.pathname,
        time_spent: timeSpentInSeconds,
        timestamp: new Date().toISOString(),
      };

      let savedTimeLogs = JSON.parse(localStorage.getItem("timeLogs")) || [];
      savedTimeLogs.push(timeData);
      localStorage.setItem("timeLogs", JSON.stringify(savedTimeLogs));
    }
  }
});

// --- 2. تتبع كلمات البحث ---
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

// هنتأكد الأول إن الفورم موجود في الصفحة الحالية
if (searchForm && searchInput) {
  searchForm.addEventListener("submit", function (event) {
    const query = searchInput.value.trim();

    if (query !== "") {
      const searchData = {
        keyword: query,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
      };

      let savedSearches = JSON.parse(localStorage.getItem("searchLogs")) || [];
      savedSearches.push(searchData);
      localStorage.setItem("searchLogs", JSON.stringify(savedSearches));
    }
  });
}
