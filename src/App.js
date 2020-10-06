import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  });

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleClick = () => {
    //console.log('Clicked here!');
    firebase.auth().signInWithPopup(googleProvider)
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
      //console.log(displayName, email, photoURL); 
    })  
    .catch( err => {
      console.log(err);
      console.log(err.message);
    });  
  }

  const handleFbSignIn = () => {
    firebase.auth().signInWithPopup(fbProvider)
    .then( result =>  {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log('FB User info', user);
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then( res => {
      const signedOutUser ={
        isSignedIn: false,        
        name: '',
        photo: '',
        email: '',
        error: '',
        success: false
      }  
      setUser(signedOutUser);   
      //console.log(res);
    })
    .catch( () => {

    });
  }

  const handleBlur = (e) => {
    //console.log(e.target.name, e.target.value);
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
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (e) => {
    if(newUser && user.email && user.password){
        //console.log('submitting');
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then( res => {
          const newUserInfo =  {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
        })
        .catch( error => {
          // Handle Errors here.
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then( res => {
        const newUserInfo =  {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        console.log('Sign in User info', res.user);
      })
      .catch(function(error) {
        // Handle Errors here.
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    }
    
    e.preventDefault();
  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,      
    }).then( () => {
      // Update successful.
      console.log('User Name updated successfully');
    }).catch( error => {
      // An error happened.
      console.log(error);
    });
  }

  return (
    <div className="App">      
      {
        user.isSignedIn ? <button onClick={handleSignOut}> Sign out</button>:        
        <button onClick={handleClick}> Sign In</button>      
      }
      <br />
      <button onClick={handleFbSignIn}> Sign in using Facebook</button>
      {
        user.isSignedIn && <div> 
            <p> Welcome, {user.name}</p>
            <p> Email: {user.email}</p>
            <img src={user.photo} alt=""/>
          </div>
      }
      <h1> Our own Authentication</h1>
        <input type="checkbox" onChange={ () => setNewUser(!newUser)} name="" id="newUser"/>
        <label htmlFor="newUser">New User Sign Up</label>
        <form action="" onSubmit={handleSubmit}>
          { newUser && <p><input type="text" name="name" id=""placeholder="Name" onBlur={handleBlur} /></p>}
          <p><input type="text" name="email" id=""placeholder="Email" onBlur={handleBlur} required="required"/></p>
          <p> <input type="password" onBlur={handleBlur} name="password" id="" placeholder="Password" required="required"/> </p>
          <p><input type="submit" value={newUser ? 'Sign Up': 'Sign In'}/></p>
        </form>  
        <p style={{color: 'red'}}>{user.error}</p>  
        { user.success && <p style={{color: 'green'}}> User { newUser ? 'Created' : 'Logged in'} successfully</p>}
    </div>
  );
}

export default App;
