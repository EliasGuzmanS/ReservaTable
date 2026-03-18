window.firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_DOMINIO.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_BUCKET.firebasestorage.app",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID",
    measurementId: "TU_MEASUREMENT_ID"
};

try {
    firebase.initializeApp(window.firebaseConfig);
    console.log("Firebase initialized");
    window.auth = firebase.auth();
    window.db = firebase.firestore();
} catch (err) {
    console.error("Firebase config error (are credentials set?):", err);
}
