// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-storage.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyABfuEHhJvt-QfiQ2sgzdIddm7Gc95fvzk",
  authDomain: "chickflex-arts.firebaseapp.com",
  projectId: "chickflex-arts",
  storageBucket: "chickflex-arts.appspot.com",
  messagingSenderId: "940156398915",
  appId: "1:940156398915:web:19e013d8036da46652d3f6",
  measurementId: "G-5KCR6BMNJX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Handle form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orderForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const photoInput = document.getElementById("photoUpload");
    const photoFile = photoInput.files[0];

    if (!photoFile) {
      alert("Please upload a photo.");
      return;
    }

    try {
      // Upload photo to Firebase Storage
      const storageRef = ref(storage, `uploads/${Date.now()}_${photoFile.name}`);
      await uploadBytes(storageRef, photoFile);
      const photoURL = await getDownloadURL(storageRef);

      // Prepare form data
      const orderData = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        message: form.message.value,
        size: form.size.value,
        framing: form.framing.value,
        rush: form.rush.value,
        country: form.country.value,
        photo_url: photoURL,
        submitted_at: new Date().toISOString()
      };

      // Save to Firestore
      await addDoc(collection(db, "orders"), orderData);

      // Store in localStorage
      for (let key in orderData) {
        localStorage.setItem(key, orderData[key]);
      }

      // Redirect to payment page
      window.location.href = "payment.html";
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    }
  });
});

