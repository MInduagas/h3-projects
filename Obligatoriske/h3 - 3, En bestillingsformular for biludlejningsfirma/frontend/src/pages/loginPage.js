import { useEffect, useState } from "react";
import logo from './../pictures/logocurr.png';
import customAlert from "./customAlert";
import CryptoJS from 'crypto-js';
import { getData, postData } from "./dataToDb";

const LoginPage = ({ setIsLoggedIn }) => {
    const [page, setPage] = useState(1);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState([]);

    const fetchZipcode = async () => {
        setCities(await getData('/api/zipcode'));
    }

    const login = async (event) => {
        const form = document.getElementById("loginForm");
        const formData = new FormData(form);
        let data = Object.fromEntries(formData);

        if (data.email === "" || data.password === "") {
            customAlert("Please fill in all fields");
            return;
        }
        const response = await postData('/api/login', data);
        const returnData = await response.json();

        if (response.status !== 200) {
            customAlert(returnData.message);
            return;
        } else {
            customAlert(returnData.message);
            localStorage.setItem('userid', CryptoJS.AES.encrypt(returnData.id.toString(), 'key123'))
            localStorage.setItem('role', CryptoJS.AES.encrypt(returnData.role, 'key123'))
            setIsLoggedIn(true);
        }
    }

    const register = async (event) => {
        const form = document.getElementById("registerForm");
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        data.zipcodeid = selectedCity;

        if (data.username === "" || data.email === "" || data.address === "" || data.password === "" || data.password === "" || selectedCity === "") {
            customAlert("Please fill in all fields");
            return;
        } else if (data.password !== data.password1) {
            customAlert("Passwords do not match");
            return;
        }

        const response = await postData('/api/register/', data);
        const returnData = await response.json();

        if (response.status !== 200) {
            customAlert(returnData.message);
            return;
        } else {
            customAlert(returnData.message);
            localStorage.setItem('userid', CryptoJS.AES.encrypt(returnData.id.toString(), 'key123'))
            localStorage.setItem('role', CryptoJS.AES.encrypt("user", 'key123'))
            setIsLoggedIn(true);
        }
    }

    useEffect(() => {
        fetchZipcode();
    }, []);
    return (
        <div className="container">
            <div className="logoutdiv">
                <button className="logoutbutton blackText" onClick={() => {setIsLoggedIn(true);}}>Back</button>
            </div>
            {page === 1 && (
                <>
                    <h1 className="title">Login</h1>
                    <form id="loginForm" className="form" onSubmit={(event) => {event.preventDefault(); login();}}>
                        <label className="label" htmlFor="email">Email:</label>
                        <input className="input" type="text" id="email" name="email" placeholder="ex. Bob@Bobsmail.com" />
                        <label className="label" htmlFor="password">Password:</label>
                        <input className="input" type="password" id="password" name="password" placeholder="ex. BobLovesFish1" />
                        <button className="button" type="submit">Login</button>
                        <p className="text"> Don't have an account? <button className="link-button" onClick={() => {setPage(2)}}> Register </button> here</p>
                    </form>
                </>
            )}
            {page === 2 && (
                <>
                    <h1 className="title">Register</h1>
                    <form id="registerForm" className="form" onSubmit={(event) => {event.preventDefault(); register()}}>
                        <label className="label" htmlFor="username">Username:</label>
                        <input className="input" type="text" id="username" name="username" placeholder=" ex. Username" />
                        <label className="label" htmlFor="email">Email:</label>
                        <input className="input" type="email" id="email" name="email" placeholder=" ex. Gmail@gmail.com" />
                        <label className="label" htmlFor="phone">Phone:</label>
                        <input className="input" id="phone" name="phone" type="tel" placeholder="ex. 12345678" pattern="[0-9]{8}" />
                        <label className="label" htmlFor="address">Address:</label>
                        <input className="input" type="text" id="address" name="address" placeholder=" ex. Bobsensstreet 99" />
                        <select className="select" onChange={(event) => {setSelectedCity(event.target.value)}}>
                            <option value="" hidden unselectable=''>Select a city</option>
                            {cities.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.zipcode} - {c.city}
                                </option>
                            ))}
                        </select>
                        <label className="label" htmlFor="password">Password:</label>
                        <input className="input" type="password" id="password" name="password" placeholder=" ex. BobLovesFish1!"    
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}" 
                            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" 
                            required />
                        <label className="label" htmlFor="password1">Confirm Password:</label>
                        <input className="input" type="password" id="password1" name="password1" placeholder=" ex. BobLovesFish1!"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}" 
                            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" 
                            required/>
                        <button className="button" type="submit">Register</button>
                        <p className="text"> Have an account? <button className="link-button" onClick={() => {setPage(1)}}> Login </button> here</p>
                    </form>
                </>
            )}
        </div>
    )
};

export default LoginPage;