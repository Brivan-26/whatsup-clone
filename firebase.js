import firebase from 'firebase';
const firebaseConfig = {
  //Your firebase confing here...
};

const app = !firebase.apps.length
            ? firebase.initializeApp(firebaseConfig)
            : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export {auth, provider}
export default db;
