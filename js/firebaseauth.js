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
  deleteDoc, getDoc,
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

// Function to display messages
// function showMessage(message, divId, isError = false) {
//   const messageDiv = document.getElementById(divId);
//   if (messageDiv) {
//     messageDiv.style.display = "block";
//     messageDiv.innerHTML = message;
//     messageDiv.style.opacity = 1;
//     messageDiv.style.color = isError ? "red" : "green"; // Change color based on error
//     setTimeout(() => {
//       messageDiv.style.opacity = 0;
//     }, 5000);
//   } else {
//     console.error(`Element with ID ${divId} not found.`);
//   }
// }

// =================================
// function showMessage(message, divId, isError = false) {
//   const messageDiv = document.getElementById(divId);
//   if (messageDiv) {
//     messageDiv.style.display = "block";
//     messageDiv.innerHTML = message;
//     messageDiv.classList.remove("alert-success", "alert-danger");
//     messageDiv.classList.add(isError ? "alert-danger" : "alert-success");

//     setTimeout(() => {
//       messageDiv.style.display = "none";
//     }, 5000);
//   } else {
//     console.error(`Element with ID ${divId} not found.`);
//   }
// }

// ================================

function showMessage(message, divId, isError = false) {
  const messageDiv = document.getElementById(divId);
  if (messageDiv) {
    messageDiv.style.display = "flex";
    messageDiv.innerHTML = isError
      ? `<span>${message}</span>` // No checkmark for error
      : `<span class="checkmark"><i class="fa fa-check" style="font-size:48px;color:green"></i></span><span>${message}</span>`; // Checkmark for success

    messageDiv.classList.remove("alert-success", "alert-danger");
    messageDiv.classList.add(isError ? "alert-danger" : "alert-success");

    setTimeout(() => {
      messageDiv.style.display = "none";
    }, 5000);
  } else {
    console.error(`Element with ID ${divId} not found.`);
  }
}

// Handle sign-up form submission
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("registrationForm");

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Get form input values
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const dob = document.getElementById("dob").value;

    // Call Firebase authentication method to create a user
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // User created successfully
        const user = userCredential.user;

        // Create user data object
        const userData = {
          email: email,
          firstName: firstName,
          lastName: lastName,
          dob: dob,
        };

        // Add user data to Firestore
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, userData);

        // Show success message
        showMessage("Account created successfully!", "signUpMessage");
      })
      .catch((error) => {
        // Handle any errors
        showMessage(`Error: ${error.message}`, "signUpMessage", true);
      });
  });
});

// Handle login form submission
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Get form input values
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Sign in with Firebase Authentication
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        showMessage("Login successful!", "signInMessage");

        // ========================
        // Clear the localStorage flag so the welcome message shows once after login
        // localStorage.removeItem("hasShownWelcome");
        localStorage.setItem("showWelcomeMessage", "true");

        // =======================
        // Redirect to the home page or dashboard
        window.location.href = "home.html";
      })
      .catch((error) => {
        showMessage(`Error: ${error.message}`, "signInMessage", true);
      });
  });
});

// Function to handle forgot password
document.addEventListener("DOMContentLoaded", () => {
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");

  forgotPasswordLink.addEventListener("click", () => {
    const email = document.getElementById("login-email").value;

    if (email) {
      // Send password reset email
      sendPasswordResetEmail(auth, email)
        .then(() => {
          showMessage(
            "Password reset email sent! Check your inbox.",
            "signInMessage"
          );
          console.log(email, auth);
        })
        .catch((error) => {
          showMessage(`Error: ${error.message}`, "signInMessage", true);
        });
    } else {
      showMessage("Please enter your email address.", "signInMessage", true);
    }
  });
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
    showMessage("Feedback submitted successfully!", "feedbackMessage");
  } catch (error) {
    console.error("Error adding feedback: ", error);
    showMessage("Failed to submit feedback.", "feedbackMessage", true);
  }
}

// Feedback submission functionality
const feedbackForm = document.getElementById("feedbackForm");
if (feedbackForm) {
  feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get form inputs
    const username = document.getElementById("username").value.trim();
    const userImage = document.getElementById("userImage").files[0]; // Get file object
    const rating = document.getElementById("rating").value;
    const feedbackMessage = document
      .getElementById("feedbackMessage")
      .value.trim();

    // Basic validation
    if (!username || !userImage || !rating || !feedbackMessage) {
      showMessage("Please fill in all fields.", "feedbackMessage", true);
      return;
    }

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `images/${userImage.name}`); // Create storage reference
      const snapshot = await uploadBytes(storageRef, userImage);

      // Get the file's download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Create feedback data object with image URL
      const feedbackData = {
        username,
        userImage: downloadURL, // Store the download URL, not the file object
        rating: parseInt(rating),
        feedbackMessage,
      };

      // Add feedback to Firestore
      await addFeedback(feedbackData);

      // Reset form
      feedbackForm.reset();

      // Hide the modal
      $("#feedbackModal").modal("hide");

      // Refresh the feedback carousel (if you have a function for it)
      initializeFeedback(); // Optional if you are rendering feedback
    } catch (error) {
      console.error("Error uploading image: ", error);
      showMessage(
        "Failed to upload image and submit feedback.",
        "feedbackMessage",
        true
      );
    }
  });
} else {
  console.error("Feedback form not found.");
}

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
  carouselItems.innerHTML = ""; // Clear existing items

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
        carouselItem.classList.add("active"); // Make the first item active
      }

      // Generate star rating HTML
      let starsHtml = "";
      const rating = parseInt(feedback.rating, 10); // Ensure rating is an integer

      for (let i = 1; i <= 5; i++) {
        starsHtml +=
          i <= rating
            ? `<span class="fa fa-star checked"></span>`
            : `<span class="fa fa-star"></span>`;
      }

      // Create the HTML structure for each feedback item
      carouselItem.innerHTML = `
      
        <div class="card" style="width:18rem">
          <div class="card-body">
            <div className="cardTitle">
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

  // Reinitialize the carousel
  $("#feedbackCarousel").carousel();
}

// Function to initialize feedback carousel on page load
async function initializeFeedback() {
  const feedbacks = await fetchFeedback();
  renderFeedbackCarousel(feedbacks);
}

// Ensure DOM is fully loaded before initializing feedback
document.addEventListener("DOMContentLoaded", () => {
  initializeFeedback();
});

//Password
document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.getElementById("profileForm");

  if (profileForm) {
    profileForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const user = auth.currentUser;

      if (!user) {
        showMessage("User is not signed in", "updatePasswordMessage", true);
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      try {
        // Reauthenticate the user
        await reauthenticateWithCredential(user, credential);

        // Update the password
        await updatePassword(user, newPassword);
        showMessage("Password updated successfully!", "updatePasswordMessage");

        // Optionally, clear the form
        profileForm.reset();
      } catch (error) {
        showMessage(`Error: ${error.message}`, "updatePasswordMessage", true);
      }
    });
  }
});

// Function to upload places to Firebase (existing functionality)
export async function uploadPlacesToFirebase(places) {
  places.forEach(async (place) => {
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
  });
}

// Function to fetch places from Firebase (existing functionality)
export async function fetchPlacesFromFirebase() {
  const placesRef = collection(db, "places"); // 'places' is the Firestore collection name
  const querySnapshot = await getDocs(placesRef);

  const places = [];
  querySnapshot.forEach((doc) => {
    places.push(doc.data());
  });

  return places;
}

export { db, storage };
