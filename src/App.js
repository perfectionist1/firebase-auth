import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    displayName: '',
    email: '',
    photoURL: ''
  });

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleClick = () => {
    //console.log('Clicked here!');
    firebase.auth().signInWithPopup(provider)
    .then( res => {
      //console.log(res);
      const {displayName, email, photoURL} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName, 
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
      console.log(displayName, email, photoURL); 
    })  
    .catch( err => {
      console.log(err);
      console.log(err.message);
    });  
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then( res => {
      const signedOutUser ={
        isSignedIn: false,
        name: '',
        photo: '',
        email: ''
      }  
      setUser(signedOutUser);   
      //console.log(res);
    })
    .catch( () => {

    });
  }

  return (
    <div className="App">      
      {
        user.isSignedIn ? <button onClick={handleSignOut}> Sign out</button>:        
        <button onClick={handleClick}> Sign In</button>      
      }
      {
        user.isSignedIn && <div> 
            <p> Welcome, {user.name}</p>
            <p> Email: {user.email}</p>
            <img src={user.photo} alt=""/>
          </div>
      }
    </div>
  );
}

export default App;
