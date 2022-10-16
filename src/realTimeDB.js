// importing realtime database dependencies
import {
    getDatabase,
    set, ref,
    get, child, onValue, 
    update,
    remove,
} from "firebase/database";
import { currentUser } from "./auth";
let database = null;
export let userType = "";

// initialize database reference
export function initializeDatabase(app) {
    database = getDatabase(app);
}

// create user in db and define its details like type and name
export function createUserInDB(uid){
    update(ref(database, 'users/' + uid),{
        type: 'emp',
        name: currentUser.displayName
    }).then(() => {
        console.log("realTimeDB.write -> if user type missing added");
    }).catch(err => {
        console.log("realTimeDB.write -> Error in adding the data");
        console.log(err.message);
    });
}

// function to get user type 
export function getUserType(uid,callback){
    const dbRef = ref(database);
    get(child(dbRef, `users/`+uid)).then((snapshot) => {
        if (snapshot.exists()) {
            let user = snapshot.val();
            if(user.type == null){
                createUserInDB(uid)
                getUserType(uid,callback)
            }else{
                userType = user.type;
                callback(user.type,uid);
            }           
        }
    }).catch((error) => {
        console.log("realTimeDB.read -> error in fetching the data");
        console.error(error);
    });
}

// function to create the time sheet entry
export function write(writeData, callback) {
    set(ref(database, 'users/' + writeData.userId+ "/"+writeData.year+"/"+writeData.month+"/"+writeData.date), {
        date: writeData.fulldate,
        startTime: writeData.startTime,
        endTime: writeData.endTime,
        leave: writeData.leave,
        file: writeData.file,
        note: writeData.note,
        status: 'Inprocess'
    }).then(() => {
        M.toast({html: 'Successfully add time sheet', classes: 'white-text green'})
        callback();
    }).catch(err => {
        console.log(err.message);
        M.toast({html: 'Error: '+err.message, classes: 'white-text red'})
    });
}

// observe the change on time sheet in real db
export function observe(callback,uid,usertype) {
    if(userType === 'emp'){
        onValue(ref(database, 'users/'+uid), (snapshot) => {
            callback(snapshot,usertype);
        });
    }else if(userType === 'mang'){
        onValue(ref(database, 'users'), (snapshot) => {
            callback(snapshot,usertype);
        });
    }
};

// function to delete timesheet 
export function delTimeSheet(path) {
    remove(ref(database, 'users/'+currentUser.uid+"/"+path))
    .then(()=>{
        M.toast({html: 'Successfully deleted Time sheet:'+path, classes: 'white-text green'})
    })
    .catch((error)=>{
        console.log(error);
        M.toast({html: 'Error: Can Not Delete! '+err.message, classes: 'white-text red'})
    }); 
};

//function to update time sheet status
export function updateSheetStatus(path,value){
    update(ref(database, 'users/'+path),{
        status: value,
    }).then(() => {
        M.toast({html: 'Successfully update status to:'+value, classes: 'white-text green'});
    }).catch(err => {
        console.log(err);
        M.toast({html: 'Error: Can Not update status, '+err.message, classes: 'white-text red'});
    });
}