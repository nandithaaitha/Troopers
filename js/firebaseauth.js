// firebaseauth.js

// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

import {
  getFirestore,
  setDoc,
  doc,
  collection,
  getDocs,
  updateDoc,
  query,
  where,
  addDoc,
  deleteDoc, 
  getDoc,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2VX0k9yX8k1R06XfgTbgYnUFeo9t_obg",
  authDomain: "test-23e49.firebaseapp.com",
  projectId: "test-23e49",
  storageBucket: "test-23e49.appspot.com",
  messagingSenderId: "990296576828",
  appId: "1:990296576828:web:4ea19e8d50d13aaeb10439",
  measurementId: "G-TQ4ET57WR0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

function showMessage(message, elementId, type = "success") {
  const messageElement = document.getElementById(elementId);
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.classList.remove("visually-hidden", "alert-success", "alert-danger");
    messageElement.classList.add(type === "success" ? "alert-success" : "alert-danger");
    messageElement.style.display = "block";
  }
}

// Handle sign-up form submission
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("registrationForm");

  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get form input values
      const firstName = document.getElementById("first-name").value;
      const lastName = document.getElementById("last-name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const dob = document.getElementById("dob").value;

      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Prepare user data to save in Firestore
        const userData = {
          email: email,
          firstName: firstName,
          lastName: lastName,
          dob: dob,
          createdAt: serverTimestamp(),
        };

        try {
          // Attempt to add user data to Firestore
          const docRef = doc(db, "users", user.uid);
          await setDoc(docRef, userData);
          console.log("User data saved to Firestore successfully");
        } catch (firestoreError) {
          // Log the error but don't show it to user since account was created
          console.warn("Firestore write failed:", firestoreError.message);
        }

        // Show success message
        showMessage("Account created successfully! Redirecting to login...", "signUpMessage", "success");

        // Redirect to login page after a brief delay
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);

      } catch (error) {
        // Handle specific Firebase Auth errors
        let errorMessage = "An error occurred during registration.";
        
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "This email is already registered. Please use a different email.";
            break;
          case 'auth/weak-password':
            errorMessage = "Password is too weak. Please choose a stronger password.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Please enter a valid email address.";
            break;
          case 'auth/network-request-failed':
            errorMessage = "Network error. Please check your connection and try again.";
            break;
          default:
            errorMessage = `Registration failed: ${error.message}`;
        }
        
        showMessage(errorMessage, "signUpMessage", "error");
      }
    });
  }
});

// Handle login form submission
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get form input values
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        showMessage("Login successful! Redirecting...", "signInMessage", "success");

        // Set welcome message flag
        localStorage.setItem("showWelcomeMessage", "true");

        // Redirect to the home page
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1000);

      } catch (error) {
        let errorMessage = "Login failed.";
        
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = "No account found with this email address.";
            break;
          case 'auth/wrong-password':
            errorMessage = "Incorrect password. Please try again.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Please enter a valid email address.";
            break;
          case 'auth/too-many-requests':
            errorMessage = "Too many failed attempts. Please try again later.";
            break;
          default:
            errorMessage = `Login failed: ${error.message}`;
        }
        
        showMessage(errorMessage, "signInMessage", "error");
      }
    });
  }
});

// Function to handle forgot password
document.addEventListener("DOMContentLoaded", () => {
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", async (event) => {
      event.preventDefault();
      
      const email = document.getElementById("login-email").value;

      if (email) {
        try {
          await sendPasswordResetEmail(auth, email);
          showMessage("Password reset email sent! Check your inbox.", "signInMessage", "success");
        } catch (error) {
          showMessage(`Error: ${error.message}`, "signInMessage", "error");
        }
      } else {
        showMessage("Please enter your email address.", "signInMessage", "error");
      }
    });
  }
});

// Function to add feedback to Firestore
async function addFeedback(feedbackData) {
  try {
    await addDoc(collection(db, "feedback"), {
      username: feedbackData.username,
      userImage: feedbackData.userImage,
      rating: parseInt(feedbackData.rating),
      feedbackMessage: feedbackData.feedbackMessage,
      createdAt: serverTimestamp(),
    });
    showMessage("Feedback submitted successfully!", "feedbackMessage", "success");
  } catch (error) {
    console.error("Error adding feedback: ", error);
    showMessage("Failed to submit feedback.", "feedbackMessage", "error");
  }
}

// Feedback submission functionality
document.addEventListener("DOMContentLoaded", () => {
  const feedbackForm = document.getElementById("feedbackForm");
  
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get form inputs
      const username = document.getElementById("username").value.trim();
      const userImage = document.getElementById("userImage").files[0];
      const rating = document.getElementById("rating").value;
      const feedbackMessage = document.getElementById("feedbackMessage").value.trim();

      // Basic validation
      if (!username || !userImage || !rating || !feedbackMessage) {
        showMessage("Please fill in all fields.", "feedbackMessage", "error");
        return;
      }

      try {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `images/${userImage.name}`);
        const snapshot = await uploadBytes(storageRef, userImage);

        // Get the file's download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Create feedback data object with image URL
        const feedbackData = {
          username,
          userImage: downloadURL,
          rating: parseInt(rating),
          feedbackMessage,
        };

        // Add feedback to Firestore
        await addFeedback(feedbackData);

        // Reset form
        feedbackForm.reset();

        // Hide the modal if it exists
        const modal = document.getElementById("feedbackModal");
        if (modal && typeof $ !== 'undefined') {
          $("#feedbackModal").modal("hide");
        }

        // Refresh the feedback carousel
        initializeFeedback();
        
      } catch (error) {
        console.error("Error uploading image: ", error);
        showMessage("Failed to upload image and submit feedback.", "feedbackMessage", "error");
      }
    });
  }
});

// Function to fetch feedback from Firestore
async function fetchFeedback() {
  try {
    const feedbackCollection = collection(db, "feedback");
    const q = query(feedbackCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const feedbacks = [];
    querySnapshot.forEach((doc) => {
      feedbacks.push(doc.data());
    });
    return feedbacks;
  } catch (error) {
    console.error("Error fetching feedback: ", error);
    return [];
  }
}

// Function to fetch feedback for admin
export async function fetchFeedbackForAdmin() {
  try {
    const feedbackCollection = collection(db, "feedback");
    const q = query(feedbackCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const feedbacks = [];
    querySnapshot.forEach((doc) => {
      feedbacks.push({ id: doc.id, ...doc.data() });
    });
    return feedbacks;
  } catch (error) {
    console.error("Error fetching feedback: ", error);
    return [];
  }
}

// Function to delete feedback from Firestore by admin
export async function deleteFeedback(feedbackId) {
  try {
    await deleteDoc(doc(db, "feedback", feedbackId));
    console.log(`Feedback with ID ${feedbackId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting feedback: ", error);
  }
}

// Function to render feedback in the carousel
function renderFeedbackCarousel(feedbacks) {
  const carouselItems = document.getElementById("carouselItems");
  
  if (!carouselItems) {
    console.log("Carousel items element not found - skipping feedback rendering");
    return;
  }

  carouselItems.innerHTML = "";

  if (feedbacks.length === 0) {
    carouselItems.innerHTML = `
      <div class="carousel-item active">
        <div class="d-flex flex-column align-items-center text-center">
          <p>No feedback available at the moment.</p>
        </div>
      </div>
    `;
  } else {
    feedbacks.forEach((feedback, index) => {
      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");
      if (index === 0) {
        carouselItem.classList.add("active");
      }

      // Generate star rating HTML
      let starsHtml = "";
      const rating = parseInt(feedback.rating, 10);

      for (let i = 1; i <= 5; i++) {
        starsHtml += i <= rating
          ? `<span class="fa fa-star checked" style="color: gold;"></span>`
          : `<span class="fa fa-star" style="color: lightgray;"></span>`;
      }

      carouselItem.innerHTML = `
        <div class="card" style="width:18rem">
          <div class="card-body">
            <div class="cardTitle">
              <div class="cardImg">
                <img src="${feedback.userImage}" class="rounded-circle mb-3" alt="User Image">
                <h5 class="card-title">${feedback.username}</h5>
              </div>
              <div class="cardStar mb-3">${starsHtml}</div>
            </div>
            <p class="card-text">${feedback.feedbackMessage}</p>
          </div>
        </div>
      `;

      carouselItems.appendChild(carouselItem);
    });
  }

  // Reinitialize the carousel if jQuery is available
  if (typeof $ !== 'undefined') {
    $("#feedbackCarousel").carousel();
  }
}

// Function to initialize feedback carousel on page load
async function initializeFeedback() {
  // Only initialize if the carousel element exists
  if (document.getElementById("carouselItems")) {
    const feedbacks = await fetchFeedback();
    renderFeedbackCarousel(feedbacks);
  }
}

// Initialize feedback when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeFeedback();
});

// Password update functionality
document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.getElementById("profileForm");

  if (profileForm) {
    profileForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const user = auth.currentUser;

      if (!user) {
        showMessage("User is not signed in", "updatePasswordMessage", "error");
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        showMessage("Password updated successfully!", "updatePasswordMessage", "success");
        profileForm.reset();
      } catch (error) {
        showMessage(`Error: ${error.message}`, "updatePasswordMessage", "error");
      }
    });
  }
});

// Function to upload places to Firebase
export async function uploadPlacesToFirebase(places) {
  for (const place of places) {
    const placeData = {
      place_name: place.place_name,
      image_path: place.image_path,
    };

    try {
      await setDoc(doc(db, "places", place.place_name), placeData);
      console.log(`Successfully added ${place.place_name} to Firestore.`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
}

// Function to fetch places from Firebase
export async function fetchPlacesFromFirebase() {
  try {
    const placesRef = collection(db, "places");
    const querySnapshot = await getDocs(placesRef);
    const places = [];
    querySnapshot.forEach((doc) => {
      places.push(doc.data());
    });
    return places;
  } catch (error) {
    console.error("Error fetching places: ", error);
    return [];
  }
}

export { db, storage, auth };
