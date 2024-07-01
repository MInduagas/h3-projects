import React, { useState, useEffect} from 'react';
import './App.css';
import FormulaPage from './pages/formulaPage';
import LoginPage from './pages/loginPage';
import AdminPage from './pages/adminPage';
import CryptoJS from 'crypto-js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') ?CryptoJS.AES.decrypt(localStorage.getItem('isLoggedIn'), 'key123').toString(CryptoJS.enc.Utf8) === 'true' : false);
  const [role, setRole] = useState(localStorage.getItem('role') ? CryptoJS.AES.decrypt(localStorage.getItem('role'), 'key123').toString(CryptoJS.enc.Utf8) : '')

  useEffect(() => {
    localStorage.setItem('isLoggedIn', CryptoJS.AES.encrypt(isLoggedIn.toString(), 'key123'));
    setRole(localStorage.getItem('role') ? CryptoJS.AES.decrypt(localStorage.getItem('role'), 'key123').toString(CryptoJS.enc.Utf8) : '')
  }, [isLoggedIn, role]);

  return(<>
    {isLoggedIn && role == "admin" 
    ? <AdminPage setIsLoggedIn={setIsLoggedIn} role={role} /> 
    : (isLoggedIn 
      ? <FormulaPage setIsLoggedIn={setIsLoggedIn}/> 
      : <LoginPage setIsLoggedIn={setIsLoggedIn} setRole={setRole} />)}
  </>)
}

/*
    {isLoggedIn && role == "admin" 
    ? <AdminPage setIsLoggedIn={setIsLoggedIn} role={role} /> 
    : (isLoggedIn 
      ? <FormulaPage setIsLoggedIn={setIsLoggedIn} role={role} /> 
      : <LoginPage setIsLoggedIn={setIsLoggedIn} setRole={setRole} />)}
*/

export default App;