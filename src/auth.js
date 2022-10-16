// importing authentication dependencies
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile,
    sendEmailVerification,
    signInWithPopup, GoogleAuthProvider,
    RecaptchaVerifier, signInWithPhoneNumber,
} from "firebase/auth";

export let currentUser = {};
let auth = {};

// creating reference to the authentication library
export function initializeAuth(app, captchaContainer, callback) {
    auth = getAuth(app);

    // listening for the auth changes
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        callback();
    });

    // loading recaptcha-container
    window.recaptchaVerifier = new RecaptchaVerifier(captchaContainer, {}, auth);
    recaptchaVerifier.render();
};

// Function to sign up the user using email and password
export function signUpWithEmailAndPassword(email, password, callback) {
    // sign up the user
    createUserWithEmailAndPassword(auth, email, password).then(cred => {
        callback();
    }).catch(err => {
        console.log(err.message)
        M.toast({html: 'Error: '+err.message, classes: 'white-text red'})
    });
};

// function to sign out the user
export function logOutUser() {
    signOut(auth).then(() => {})
    .catch(err => {
        console.log(err.message)
        M.toast({html: 'Error: '+err.message, classes: 'white-text red'})
    });
};

// function to login the user
export function logInWithEmailAndPassword(email, password, callback) {
    // log the user in
    signInWithEmailAndPassword(auth, email, password).then((cred) => {
        callback();
    }).catch(err => {
        console.log(err.message)
        M.toast({html: 'Error: '+err.message, classes: 'white-text red'})
    });
};

// update account information
export function updateAccount(user, callback) {
    updateProfile(auth.currentUser, user).then(() => {
        M.toast({html: 'Successfully update account info', classes: 'white-text green'})
        callback();
    }).catch(err => {
        console.log('auth.updateAccount.updateProfile -> Error');
        console.log(err.message);
        M.toast({html: 'Error: '+err.message, classes: 'white-text red'})
    });
};

// Function to send verification mail
export function verifyEmail(callback) {
    // update account information
    sendEmailVerification(auth.currentUser).then(() => {
        console.log('auth.verifyEmail.sendEmailVerification -> Email Verification Sent');
        callback();
    }).catch(err => {
        console.log('auth.verifyEmail.sendEmailVerification -> Error');
        console.log(err.message)
    });
};

// Function to login via google
export function googleLogin(callback) {
    const googleProvider = new GoogleAuthProvider();
    signInWithPopup(auth, googleProvider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log("credential: " + credential);
        const token = credential.accessToken;
        console.log("token: " + token);
        // The signed-in user info.
        const user = result.user;
        console.log("user: " + user);
        callback();
    }).catch((error) => {
        console.log(error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
    });
};

// function to login via phone number
export function loginWithPhoneNumber(telephone,callback) {
    // log the user in
    signInWithPhoneNumber(auth, telephone, window.recaptchaVerifier).then((confirmationResult) => {
        console.log("auth.loginWithPhoneNumber.signInWithPhoneNumber -> OTP is send");
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        callback();
    }).catch((err) => {
        console.log("auth.loginWithPhoneNumber.signInWithPhoneNumber -> Error");
        console.log(err.message)
    });
};