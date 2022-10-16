console.log('js working');

// setup materialize components
document.addEventListener('DOMContentLoaded', function () {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

});

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
    currentUser,
    initializeAuth,
    signUpWithEmailAndPassword,
    logOutUser,
    logInWithEmailAndPassword,
    googleLogin,
    loginWithPhoneNumber,
} from './auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzs7Sh5mn_1OLHcAsbqyLWXv6O0mSvM8E",
    authDomain: "pwa-nagp.firebaseapp.com",
    databaseURL: "https://pwa-nagp-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pwa-nagp",
    storageBucket: "pwa-nagp.appspot.com",
    messagingSenderId: "463892819039",
    appId: "1:463892819039:web:265ffc40c16cdee9b97fea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const setupUI = (user) => {
    console.log(user);
    // DOM elements
    const loggedOutLinks = document.querySelectorAll('.logged-out');
    const loggedInLinks = document.querySelectorAll('.logged-in');
    const accountDetails = document.querySelector('.account-details');
    const accountEmail = document.querySelector('#account-email');
    const accountPassword = document.querySelector('#account-password');
    const accountDisplayName = document.querySelector('#account-displayName');
    const accountPhotoURL = document.querySelector('#account-photoURL');
    const accountPhoneNumber = document.querySelector('#account-phoneNumber');
    if (user) {
        // account info
        let html;
        if (user.email) {
            html = user.emailVerified
                ? `<div>Logged in as ${user.email} (email verified)</div>`
                : `<div>Logged in as ${user.email} (email not verified)</div>`;
        } else {
            html = `<div>Logged in as ${user.phoneNumber} (mobile verified)</div>`
        }
        accountDetails.innerHTML = html;
        accountEmail.value = user.email;
        accountPassword.value = user.password;
        accountDisplayName.value = user.displayName;
        accountPhotoURL.value = user.photoURL;
        accountPhoneNumber.value = user.phoneNumber;
        // toggle user UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        // clear account info
        accountDetails.innerHTML = ''
        accountEmail.value = '';
        accountPassword.value = '';
        accountDisplayName.value = '';
        accountPhotoURL.value = '';
        accountPhoneNumber.value = '';
        // toggle user elements
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
};

// setup guides
const setupGuides = (data, usertype) => {
    const guideList = document.querySelector('.guides');
    if (data.exists()) {
        guideList.innerHTML = '';
        const li = document.createElement('li');
        if (usertype === 'emp') {
            const years = data.val();
            for (let year in years) {
                if (year == "type" || year == "name") { continue; }
                const divYear = document.createElement('div');
                divYear.classList.add('grey');
                divYear.classList.add('lighten-4');
                divYear.setAttribute('style', 'margin:10px;')
                const h3 = document.createElement('h3');
                h3.setAttribute('style', 'text-align:center;')
                h3.textContent = "Year:" + year;
                divYear.appendChild(h3);

                for (let month in years[year]) {
                    const divMonth = document.createElement('div');
                    const h5 = document.createElement('h5');
                    h5.textContent = "Month:" + (parseInt(month) + 1);
                    h5.setAttribute('style', 'text-align:center;')
                    divMonth.appendChild(h5);
                    divMonth.classList.add(['row']);
                    divMonth.classList.add('grey');
                    divMonth.classList.add('lighten-3');

                    for (let date in years[year][month]) {
                        const dateDiv = document.createElement('div');
                        dateDiv.classList.add('col')
                        dateDiv.classList.add('s2');
                        dateDiv.classList.add('teal');
                        dateDiv.classList.add('lighten-5');
                        dateDiv.setAttribute('style', 'margin:10px;');
                        const dateData = years[year][month][date]

                        let dateInnerHtml = '<h6 style="text-align:center;">' + new Date(dateData.date).toDateString() + '</h6>';
                        if (!dateData.leave) {
                            dateInnerHtml += '<b>Working' + '<br>' + 'Start Time: </b>' + dateData.startTime + '<br>' + '<b>End Time: </b>' + dateData.endTime;
                            dateInnerHtml += '<br><b>Note: </b>' + dateData.note + "<br><b>Status: </b>" + dateData.status + "<br>";
                            dateDiv.innerHTML = dateInnerHtml;
                        } else {
                            dateInnerHtml += '<b>On Leave <br>'+ 'Start Time: </b>' + dateData.startTime + '<br>' + '<b>End Time: </b>' + dateData.endTime;
                            dateInnerHtml += "<br><b>Status: </b>" + dateData.status + "<br>";
                            dateDiv.innerHTML = dateInnerHtml;
                            let downloadBut = document.createElement('button');
                            downloadBut.classList.add('waves-effect');
                            downloadBut.classList.add('waves-light');
                            downloadBut.classList.add('btn');
                            downloadBut.setAttribute('style', 'margin:10px;');
                            downloadBut.value = 'users/'+currentUser.uid+'/'+year+'/'+month+'/'+date+"/img.jpg";
                            downloadBut.addEventListener("click", function () {
                                download(this.value);
                            });
                            downloadBut.textContent = "Download";
                            dateDiv.appendChild(downloadBut)
                        }
                        let delbut = document.createElement('button');
                        delbut.classList.add('waves-effect');
                        delbut.classList.add('waves-light');
                        delbut.classList.add('btn');
                        delbut.setAttribute('style', 'margin:10px;');
                        delbut.value = year + '/' + month + '/' + date;
                        let imgdel = document.createElement('img');
                        imgdel.src = "img/delete.png";
                        imgdel.height = "20"
                        imgdel.alt = "Delete"
                        delbut.appendChild(imgdel);
                        delbut.addEventListener("click", function () {
                            delTimeSheet(this.value);
                        });
                        dateDiv.appendChild(delbut);
                        divMonth.appendChild(dateDiv);
                    }
                    divYear.appendChild(divMonth)
                }
                li.appendChild(divYear);
            }
        } else if (usertype === 'mang') {
            const users = data.val();
            for (let user in users) {
                const divUser = document.createElement('div');
                divUser.classList.add('grey');
                divUser.classList.add('lighten-4');
                divUser.setAttribute('style', 'margin:10px;')

                const h3 = document.createElement('h3');
                h3.setAttribute('style', 'text-align:center;')
                h3.textContent = "User:" + users[user].name;
                divUser.appendChild(h3);

                let years = users[user];
                if (users[user].type === "mang") { continue; }

                for (let year in years) {
                    if (year == "type" || year == "name") { continue; }
                    const divYear = document.createElement('div');
                    divYear.classList.add('grey');
                    divYear.classList.add('lighten-4');
                    divYear.setAttribute('style', 'margin:10px;')

                    const h3 = document.createElement('h3');
                    h3.setAttribute('style', 'text-align:center;')
                    h3.textContent = "Year:" + year;
                    divYear.appendChild(h3);

                    for (let month in years[year]) {
                        const divMonth = document.createElement('div');
                        const h5 = document.createElement('h5');
                        h5.textContent = "Month:" + (parseInt(month) + 1);
                        h5.setAttribute('style', 'text-align:center;')
                        divMonth.appendChild(h5);
                        divMonth.classList.add(['row']);
                        divMonth.classList.add('grey');
                        divMonth.classList.add('lighten-3');


                        for (let date in years[year][month]) {
                            const dateDiv = document.createElement('div');
                            dateDiv.classList.add('col')
                            dateDiv.classList.add('s3');
                            dateDiv.classList.add('teal');
                            dateDiv.classList.add('lighten-5');
                            dateDiv.setAttribute('style', 'margin:10px;');
                            const dateData = years[year][month][date]

                            let dateInnerHtml = '<h6 style="text-align:center;">' + new Date(dateData.date).toDateString() + '</h6>';
                            if (!dateData.leave) {
                                dateInnerHtml += '<b>Working' + '<br>' + 'Start Time: </b>' + dateData.startTime + '<br>' + '<b>End Time: </b>' + dateData.endTime;
                                dateInnerHtml += '<br><b>Note: </b>' + dateData.note + "<br><b>Status: </b>" + dateData.status + "<br>";
                                dateDiv.innerHTML = dateInnerHtml;
                            } else {
                                dateInnerHtml += '<b>On Leave <br>'+ 'Start Time: </b>' + dateData.startTime + '<br>' + '<b>End Time: </b>' + dateData.endTime;
                                dateInnerHtml += "<br><b>Status: </b>" + dateData.status + "<br>";
                                dateDiv.innerHTML = dateInnerHtml;
                                let downloadBut = document.createElement('button');
                                downloadBut.classList.add('waves-effect');
                                downloadBut.classList.add('waves-light');
                                downloadBut.classList.add('btn');
                                downloadBut.setAttribute('style', 'margin:10px;');
                                downloadBut.value = 'users/'+user+'/'+year+'/'+month+'/'+date+"/img.jpg";
                                downloadBut.addEventListener("click", function () {
                                    download(this.value);
                                });
                                downloadBut.textContent = "Download";
                                dateDiv.appendChild(downloadBut)
                            }
                            let apbut = document.createElement('button');
                            apbut.classList.add('waves-effect');
                            apbut.classList.add('waves-light');
                            apbut.classList.add('white');
                            apbut.classList.add('btn');
                            apbut.style = "margin:5px";
                            apbut.value = user + '/' + year + '/' + month + '/' + date;
                            let imgtick = document.createElement('img');
                            imgtick.src = "img/tick.png";
                            imgtick.height = "20"
                            imgtick.alt = "Delete"
                            apbut.appendChild(imgtick);
                            apbut.addEventListener("click", function () {
                                updateSheetStatus(this.value, 'Approve');
                            });
                            dateDiv.appendChild(apbut);

                            let cnbut = document.createElement('button');
                            cnbut.classList.add('waves-effect');
                            cnbut.classList.add('waves-light');
                            cnbut.classList.add('white');
                            cnbut.classList.add('btn');
                            cnbut.style = "margin:5px";
                            cnbut.value = user + '/' + year + '/' + month + '/' + date;
                            let imgcross = document.createElement('img');
                            imgcross.src = "img/cross.png";
                            imgcross.height = "20"
                            imgcross.alt = "Delete"
                            cnbut.appendChild(imgcross);
                            cnbut.addEventListener("click", function () {
                                updateSheetStatus(this.value, 'Rejected');
                            });
                            dateDiv.appendChild(cnbut);


                            divMonth.appendChild(dateDiv);
                        }

                        divYear.appendChild(divMonth)
                    }
                    divUser.appendChild(divYear)

                }
                li.appendChild(divUser);
            }
        }

        guideList.appendChild(li);


        // data.forEach(year => {
        //     const li = document.createElement('li');
        //     // setting the year title
        //     const divYear = document.createElement('div');
        //     div1.textContent = year;
        //     div1.classList.add('grey');
        //     div1.classList.add('lighten-4');

        //     year.forEach(month => {
        //         const divMonth = document.createElement('div');
        //     div2.textContent = month;
        //     div2.classList.add('collapsible-body');
        //     div2.classList.add('white');

        //     });
        //     // setting the guide content
        //     const div2 = document.createElement('div');
        //     div2.textContent = guide.content;
        //     div2.classList.add('collapsible-body');
        //     div2.classList.add('white');

        //     // setting edit button
        //     const editbutton = document.createElement('button');
        //     editbutton.classList.add('darken-2');
        //     editbutton.classList.add('btn');
        //     editbutton.classList.add('yellow');
        //     editbutton.classList.add('z-depth-0');
        //     editbutton.classList.add('modal-trigger');
        //     editbutton.textContent = 'Edit';
        //     editbutton.addEventListener('click', (e) => {
        //         editRealTimeDB(guide);
        //     });
        //     editbutton.setAttribute("data-target", "modal-update");
        //     div2.appendChild(editbutton);

        //     // setting delete button
        //     const deletebutton = document.createElement('button');
        //     deletebutton.classList.add('darken-2');
        //     deletebutton.classList.add('btn');
        //     deletebutton.classList.add('green');
        //     deletebutton.classList.add('z-depth-0');
        //     deletebutton.textContent = 'Delete';
        //     deletebutton.addEventListener('click', (e) => {
        //         deleteForm(guide);
        //     });
        //     div2.appendChild(deletebutton);

        //     // appending to list
        //     li.appendChild(div1);
        //     li.appendChild(div2);
        //     guideList.appendChild(li);
        // });
    } else {
        guideList.innerHTML = '<h5 class="center-align">Create Time sheet to view them.</h5>';
    }
};

// calling auth.js to initialize auth.js
const initializeAuthCallback = () => {
    if (currentUser) {
        getUserType(currentUser.uid, updateUIForUserType)
    } else {
        const guideList = document.querySelector('.guides');
        guideList.innerHTML = '<h5 class="center-align">Login to view Time-Sheets.</h5>';
    }
    setupUI(currentUser);
};
initializeAuth(app, 'recaptcha-container', initializeAuthCallback);

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user
    signUpWithEmailAndPassword(email, password, signUpFormCallback);
});
const signUpFormCallback = () => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
};

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    logOutUser();
});

// login with email and password 
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    // log the user in
    logInWithEmailAndPassword(email, password, loginFormCallback);
});
const loginFormCallback = () => {
    // close the login modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
    loginTelephoneForm.reset();
    loginTelephoneOTPForm.reset();
    loginTelephoneOTPForm.style.display = "none";
    document.getElementById("recaptcha-container").style.display = "block";
    loginTelephoneForm['login-tel'].readOnly = false;
    loginTelephoneForm['send-otp-btn'].style.display = "block";
};

// login with phone number
const loginTelephoneForm = document.querySelector('#login-telephone-form');
loginTelephoneForm.addEventListener('submit', (e) => {
    e.preventDefault();

    loginTelephoneOTPForm.style.display = "none";
    // get user info
    const telephone = loginTelephoneForm['login-tel'].value;
    console.log(telephone);

    // log the user in
    loginWithPhoneNumber(telephone, loginTelephoneFormCallback);
});
const loginTelephoneFormCallback = () => {
    loginTelephoneOTPForm.style.display = "block";
    document.getElementById("recaptcha-container").style.display = "none";
    loginTelephoneForm['login-tel'].readOnly = true;
    loginTelephoneForm['send-otp-btn'].style.display = "none";
};
// handling otp
const loginTelephoneOTPForm = document.querySelector('#login-otp-form');
loginTelephoneOTPForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const otp = loginTelephoneOTPForm['login-otp'].value;

    // Verifying the otp
    confirmationResult.confirm(otp).then((result) => {
        console.log("loginTelephoneOTPForm.confirmationResult -> User signed in");
        console.log(result);
        // User signed in successfully.
        const user = result.user;
        console.log(user);
        // ...
        loginFormCallback();
    }).catch((error) => {
        console.log("loginTelephoneOTPForm.confirmationResult -> Error");
        console.log(err.message)
    });
});

// login with google
const googleLoginForm = document.querySelector('#login-google');
googleLoginForm.addEventListener('click', (e) => {
    e.preventDefault();
    googleLogin(loginFormCallback);

});

// importing the depenedency from realtimedb
import {
    initializeDatabase,
    write,
    observe,
    getUserType,
    delTimeSheet,
    updateSheetStatus
} from "./realTimeDB.js";

initializeDatabase(app);

// writing to realtime database
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let dateData = new Date(createForm.ctsDate.value);
    let path = "";
    const createFormData = {
        date: dateData.getDate(),
        year: dateData.getFullYear(),
        month: dateData.getMonth(),
        fulldate: dateData.toJSON(),
        startTime: createForm.ctsStarttime.value,
        endTime: createForm.ctsEndtime.value,
        leave: createForm.ctsLeave.checked,
        file: "",
        note: createForm.ctsNote.value,
        userId: currentUser.uid,
    };
    if (createForm.ctsLeave.checked) {
        var file = createForm.ctsFileupload.files[0];
        console.log(file);
        if (file) {
            path = 'users/' + currentUser.uid + "/" + dateData.getFullYear() + "/" + dateData.getMonth() + "/" + dateData.getDate() + "/img.jpg"
            upload(file, path, () => {
                createFormData.file = path;
                write(createFormData, createFormCallback);
            });
        }
    } else {
        write(createFormData, createFormCallback);
    }

});
const createFormCallback = () => {
    // close the create modal & reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
};

async function updateUIForUserType(userType, uid) {
    let addtime = document.getElementById('addTimeSheet');
    console.log(userType);
    if (userType === 'emp') {
        addtime.style.display = 'block';
    } else if (userType === 'mang') {
        addtime.style.display = 'none';
    }
    observe(setupGuides, uid, userType);
}

//storage
// importing storage dependencies
import {
    initializeStorage,
    upload,
    download
} from "./storage.js";

// initializing storage
initializeStorage(app);

if ("serviceWorker" in navigator) {
    console.log('serviceWorker','abc')
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("sw.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err));
    });
  }
  