import '../styles/globals.css'
import '../styles/sidebar.css'
import '../styles/chatList.css'
import '../styles/login.css'
import '../styles/chat.css'
import '../styles/message.css'
import '../styles/nochat.css'
import '../styles/modal.css'
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../firebase';
import db from '../firebase';
import Login from '../components/Login.jsx';
import Loading from '../components/Loading.jsx';
import firebase from 'firebase';
import {useEffect} from 'react';
function MyApp({ Component, pageProps }) {

  const [user, loading] = useAuthState(auth);
  useEffect(()=> {
    if(user) {
    db.collection("user").doc(user.uid).set({
      email:user.email,
      lastSeen:firebase.firestore.FieldValue.serverTimestamp(),
      photoUrl: user.photoURL,
    },{merge:true});
  }
  },[user])
  

  if(loading) return <Loading />

  if(!user) return <Login />
  return <Component {...pageProps} />
}

export default MyApp
