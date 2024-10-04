// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB2VX0k9yX8k1R06XfgTbgYnUFeo9t_obg",
    authDomain: "test-23e49.firebaseapp.com",
    projectId: "test-23e49",
    storageBucket: "test-23e49.appspot.com",
    messagingSenderId: "990296576828",
    appId: "1:990296576828:web:5a8d37b39f9dbefeb10439",
    measurementId: "G-D7BFY5HX7W"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  document.addEventListener("DOMContentLoaded", function () {
    // Check if we are on the register page
    const registerForm = document.querySelector('#register-form');
    if (registerForm) {
      console.log("Register form detected.");
      // Handle registration form submission
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();  // Prevent the form from refreshing the page
  
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        // Firebase registration function
        auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Registration successful
            alert('Registration successful! Redirecting to login page...');
            window.location.href = 'login.html';  // Redirect to login page
          })
          .catch((error) => {
            console.error(error.message);
            alert('Error: ' + error.message);
          });
      });
    }
  
    // Check if we are on the login page
    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
      console.log("Login form detected.");
      // Handle login form submission
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            alert('Login successful!');
            // You can redirect to a dashboard page or home page after login
          })
          .catch((error) => {
            alert('Error: ' + error.message);
          });
      });
    }
  });
  