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

// Firebase configuration
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

    // Validate required fields by checking their trimmed values
    const requiredFields = ['name', 'email', 'phone', 'size', 'framing', 'rush', 'country'];
    for (let field of requiredFields) {
      if (!form[field] || !form[field].value.trim()) {
        alert(`Please fill in the ${field} field.`);
        return;
      }
    }

    const photoInput = document.getElementById("photoUpload");
    const photoFile = photoInput.files[0];

    if (!photoFile) {
      alert("Please upload a photo.");
      return;
    }

    try {
      // Sanitize file name and create a storage reference
      const timestamp = Date.now();
      const sanitizedFileName = photoFile.name.replace(/\s+/g, "_");
      const storageRef = ref(storage, `uploads/${timestamp}_${sanitizedFileName}`);

      // Upload photo to Firebase Storage
      await uploadBytes(storageRef, photoFile);
      const photoURL = await getDownloadURL(storageRef);

      // Prepare form data to be stored
      const orderData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        message: form.message.value.trim(),
        size: form.size.value,
        framing: form.framing.value,
        rush: form.rush.value,
        country: form.country.value,
        photo_url: photoURL,
        submitted_at: new Date().toISOString()
      };

      // Save the order data to Firestore in the "orders" collection
      await addDoc(collection(db, "orders"), orderData);

      // Store all order data in localStorage for later use (e.g., payment page)
      Object.keys(orderData).forEach(key => {
        localStorage.setItem(key, orderData[key]);
      });

      // Redirect to payment page upon successful submission
      window.location.href = "payment.html";
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong while submitting your order. Please try again.");
    }
  });
});
