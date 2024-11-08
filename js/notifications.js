// Sample notifications data for testing (remove/comment this section in production)
if (!localStorage.getItem("notifications")) {
  localStorage.setItem("notifications", JSON.stringify([
    { message: "New message 1", timestamp: "2023-10-01 10:00", read: false },
    { message: "New message 2", timestamp: "2023-10-02 11:30", read: false }
  ]));
  console.log("Sample notifications added to localStorage.");
} else {
  console.log("Notifications already present in localStorage.");
}

// Function to load and display notifications
function loadNotifications() {
  console.log("Attempting to load notifications...");

  // Check if elements are available
  const notificationCount = document.getElementById("notification-count");
  const notificationList = document.getElementById("notification-list");

  if (!notificationCount || !notificationList) {
    console.error("Notification elements not found. Retrying in 100ms...");
    setTimeout(loadNotifications, 100); // Retry after 100 ms
    return;
  }

  // Load notifications from localStorage
  const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  console.log("Notifications loaded from localStorage:", notifications);

  // Filter unread notifications
  const unreadNotifications = notifications.filter(n => !n.read);
  console.log("Unread notifications after filtering:", unreadNotifications);

  // Set the count of unread notifications
  notificationCount.textContent = unreadNotifications.length > 0 ? unreadNotifications.length : '';
  notificationCount.style.display = unreadNotifications.length > 0 ? "inline" : "none";
  console.log("Notification count set to:", notificationCount.textContent);

  // Check if notification count is visually updated
  setTimeout(() => {
    console.log("Forced refresh of notification count for display:", notificationCount.textContent);
  }, 100); // Forced refresh delay

  // Populate dropdown with unread notifications
  notificationList.innerHTML = "";
  if (unreadNotifications.length > 0) {
    unreadNotifications.forEach((notification, index) => {
      notificationList.innerHTML += `
        <div class="dropdown-item" onclick="markNotificationRead(${index})">
          <div>${notification.message}</div>
          <small class="text-muted">${notification.timestamp}</small>
        </div>`;
    });
    console.log("Dropdown populated with unread notifications.");
  } else {
    notificationList.innerHTML = '<span class="dropdown-item text-center">No new notifications</span>';
    console.log("No unread notifications found.");
  }
}

// Function to mark a notification as read and reload the list
function markNotificationRead(unreadIndex) {
  let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  const unreadNotifications = notifications.filter(n => !n.read);

  if (unreadNotifications[unreadIndex]) {
    const actualIndex = notifications.indexOf(unreadNotifications[unreadIndex]);
    notifications[actualIndex].read = true;

    // Save changes and reload
    localStorage.setItem("notifications", JSON.stringify(notifications));
    console.log(`Notification at index ${actualIndex} marked as read.`);
    loadNotifications();
  }
}

// Toggle the notification dropdown visibility
function toggleNotificationDropdown(event) {
  event.preventDefault();
  const notificationList = document.getElementById("notification-list");
  if (notificationList) {
    notificationList.style.display = notificationList.style.display === "block" ? "none" : "block";
    console.log("Notification dropdown toggled:", notificationList.style.display);
  }
}

// Initialize notifications and listen for storage changes
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded. Initializing notifications...");
  loadNotifications();
});

// Listen for changes in localStorage and reload notifications if updated
window.addEventListener("storage", (event) => {
  if (event.key === "notifications") {
    console.log("Storage change detected. Reloading notifications...");
    loadNotifications();
  }
});
