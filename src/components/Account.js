import React, { useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default function Account({ loggedInStatus, isAuth }) {
  const [ form, setForm ] = useState('login');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ error, setError ] = useState('');
  const [ success, setSuccess ] = useState('');

  // switch form
  const changeForm = (type) => { 
    if(type === 'login') {
      setForm('login');
      setError('');
      setSuccess('');
      setEmail('');
      setPassword('');
    } else if (type === 'signup') {
      setForm('signup');
      setError('');
      setSuccess('');
      setEmail('');
      setPassword('');
    } else {
      setForm('login');
    }
  }
  
  // onchange email and password
  const handleInput = (e, type) => {
    if(type === 'txtEmail') {
      setEmail(e.target.value);
    }
    if(type === 'txtPassword') {
      setPassword(e.target.value);
    }
  }

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // get credentials from state
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    }
    if(form === 'login') {
      // handle login request
      setError('');
      setSuccess('');

      if(email && password && email.length > 6 && password.length > 6) {
        axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA7BXfCDlD4XUpkzbbBcSYYhlkiJI_SiYg', authData)
        .then(response => {
          // console.log(response);
          // console.log(response.data);
          
          // console.log(response.data.idToken);
          // console.log(response.data.expiresIn);
          // console.log(response.data.localId);
  
          localStorage.setItem("token", response.data.idToken);	
          localStorage.setItem("expirySeconds", response.data.expiresIn);
          localStorage.setItem("localID", response.data.localId);
          localStorage.setItem("email", response.data.email);
          // add expiry seconds in current date time and store that too
          let expirationDateTime = new Date(new Date().getTime() + response.data.expiresIn * 1000);
          localStorage.setItem("expiryDateTime", expirationDateTime);
  
          // clear fields
          setEmail('');
          setPassword('');

          setSuccess('Login success...')
  
          // fire loggedin in status to home
          loggedInStatus(true);

          // dispatch login success
          // save token and time in local storage
        })
        .catch(error => {
          console.log("Login Failed", error);
          // dispatch auth failed
          setError('Login failed');
        })
      } else {
        setError('Use valid Email address and min 6 characters are required for each field')
      }

    }
    if(form === 'signup') {
      // handle signup request
      setError('');
      setSuccess('');

      if(email && password && email.length > 6 && password.length > 6) {
        axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA7BXfCDlD4XUpkzbbBcSYYhlkiJI_SiYg', authData)
        .then(response => {
          // console.log(response);
          // console.log(response.data);

          setSuccess('Account created successfully... Please login')
  
          // clear fields
          setEmail('');
          setPassword('');
          setForm('login');
  
          // dispatch signup success
        })
        .catch(error => {
          console.log("Signup Failed", error);
          // dispatch signup failed
          setError('Signup failed');
        })
      } else {
        setError('Use valid Email address and min 6 characters are required for each field')
      }

    }
  }
  return (
    <div className="page-wrap">
      { isAuth ? <Redirect to="/" /> : null }
      <h4>Login or Create Account</h4>
        <form onSubmit={ handleSubmit }>
          <div className="account">
            { error ? <div className="error">{ error }</div> : null }
            { success ? <div className="success">{ success }</div> : null }
          { form === 'login' ? <h4>Login</h4> : <h4>Create Account</h4> }
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={ email } onChange={ (e) => handleInput(e, 'txtEmail') } />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={ password } onChange={ (e) => handleInput(e, 'txtPassword') } />
            </div>
            <div className="form-group">
              { form === 'login' ? <button className="btn">Login</button> : <button className="btn">Create Account</button> }
            </div>
            { form === 'login' ? (
              <div className="link" onClick={ () => changeForm('signup') }>Don't have account? Create New Account.</div>
            ) : (
              <div className="link" onClick={ () => changeForm('login') }>Already have account? Login.</div>
            ) }
          </div>
        </form>
      </div>
  )
}
