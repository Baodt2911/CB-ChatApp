import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCLQMrKMIBQ1SSaVXnYOIA7xRWnaujqs3k",
    authDomain: "chat-app-db76c.firebaseapp.com",
    projectId: "chat-app-db76c",
    storageBucket: "chat-app-db76c.appspot.com",
    messagingSenderId: "229921808609",
    appId: "1:229921808609:web:810c43199698879db457a0",
    measurementId: "G-XLGK7BY9GY"
};
// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
const FacebookButton = document.querySelector(".btn-login-facebook")
const GoogleButton = document.querySelector(".btn-login-google")
const LogOutButton = document.querySelector(".btn-logout")
const FacebookProvider = new FacebookAuthProvider();
const GoogleProvider = new GoogleAuthProvider()
const avatarUser = document.querySelector(".avatar img")
const nameUser = document.querySelector(".name")
const avatarMessageUser = document.querySelectorAll(".avatar-message img")
const nameMessageUser = document.querySelectorAll(".name-you-user")
if (FacebookButton && GoogleButton) {
    FacebookButton.addEventListener("click", () => {
        signInWithPopup(auth, FacebookProvider)
    })
    GoogleButton.addEventListener("click", () => {
        signInWithPopup(auth, GoogleProvider)
    })

}
if (LogOutButton) {
    LogOutButton.addEventListener("click", () => {
        auth.signOut();
        alert("Đăng xuất")
    })
}
const renderUser = (displayName, uid, photoURL) => {
    if (nameUser && avatarUser && avatarMessageUser && nameMessageUser) {
        nameUser.innerText = displayName
        avatarUser.src = photoURL
        avatarMessageUser.forEach(item => item.src = photoURL)
        nameMessageUser.forEach(item => item.innerText = displayName)
    }
}
onAuthStateChanged(auth, (user) => {
    if (user) {
        const { displayName, uid, photoURL } = user
        renderUser(displayName, uid, photoURL)
        window.location.href = './index.html'
        alert("Đăng nhập thành công");
    } else {
        window.location.href = './login.html'
        alert("Trở lại đăng nhập");
    }
})
