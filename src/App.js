import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import Account from './components/Account';
import Dashboard from './components/Dashboard';

function App() {
  const [ isAuth, setIsAuth ] = useState(false);
  
  useEffect(() => {
    // check loggedin user
    if(localStorage.token) {
      setIsAuth(true);
    }
    checkAuthTimeOut();
  }, [])

  const checkAuthTimeOut = () => {
    let currentDateTime = new Date();
    if(Date.parse(localStorage.expiryDateTime) < Date.parse(currentDateTime)) {
      logOut();
    }
  }

  const loggedInStatus = (action) => {
    if(localStorage.token && action === true) {
      setIsAuth(true);
    }
  }

  const logOut = (e) => {
    if (e) { e.preventDefault(); }
    localStorage.removeItem("token");
    localStorage.removeItem("localID");
    localStorage.removeItem("expiry");
    localStorage.removeItem("email");
    localStorage.removeItem("expiryDateTime");
    localStorage.removeItem("expirySeconds");
    setIsAuth(prevState => !prevState)
  }

  return (
    <Router>
      {/* if logged in - go to dashboard - else - homepage */}
      { isAuth ? <Redirect to="/dashboard" /> : <Redirect to="/" /> }
      <div className="App" onClick={ checkAuthTimeOut }>
        <div className="header">
          <div className="logo">
            <Link to="/">SiteName</Link>
          </div>
          <div className="nav">
            <div className="nav-wrap">
              <Link to="/">Home</Link>
              { isAuth ? <Link to="/dashboard">Dashboard</Link> : <Link to="/account">Dashboard</Link> }
              { isAuth ? <a href="#" onClick={ logOut }>Logout</a> : <Link to="/account">Login</Link> }
            </div>
          </div>
        </div>
        
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          { isAuth ? (
            <Route path="/dashboard">
              <Dashboard
                isAuth={isAuth}
              />
            </Route>
          ) : (
            <Route path="/account">
              <Account
                loggedInStatus={ loggedInStatus }
                isAuth={ isAuth }
              />
            </Route>
          )}
          <Route path="/account">
            <Account
              loggedInStatus={ loggedInStatus }
              isAuth={ isAuth }
            />
          </Route>
        </Switch>

      </div>
    </Router>
  );
}

export default App;
