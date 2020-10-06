import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
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

  const handleBlur = (e) => {
    console.log(e.target.name, e.target.value);
    let isFormValid = true;
    if(e.target.name === 'email'){
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
      //console.log(isEmailValid);
    }
    if(e.target.name === 'password'){
      const isPassWordValid = e.target.value.length > 6 ;
      const hasPasswordNumber = /\d{1}/.test(e.target.value);
      //console.log(isPassWordValid && hasPasswordNumber);
      isFormValid = isPassWordValid && hasPasswordNumber;
    }
    if(isFormValid){
      const newUser = {...user};
      newUser[e.target.name] = e.target.value;
      setUser(newUser);
    }
  }

  const handleSubmit = () => {

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
      <h1> Our own Authentication</h1>
        <form action="" onSubmit={handleSubmit}>
          <p><input type="text" name="name" id=""placeholder="Name" onBlur={handleBlur} /></p>
          <p><input type="text" name="email" id=""placeholder="Email" onBlur={handleBlur} required="required"/></p>
          <p> <input type="password" onBlur={handleBlur} name="password" id="" placeholder="Password" required="required"/> </p>
          <p><input type="submit" value="Submit"/></p>
        </form>   

        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>  
          <p>Password: {user.password}</p>
        </div>   
    </div>
  );
}

export default App;
