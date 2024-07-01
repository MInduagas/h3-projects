import React from "react";
import {useState, useEffect} from "react";
import "./style.scss";

const Navbar = () => {
    const toggleNavbar = () => {
        const navbarItems = document.querySelector(".navbar-items");
        navbarItems.classList.toggle("active");
        const burger = document.querySelector(".burger");
        burger.classList.toggle("active");
    };  

    const toPage = (page) => {
        return () => {
            window.location.href = page;
        }
    }
    
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/800px-Instagram_logo_2022.svg.png" alt="logo" />
            </div>
            <div className="navbar-items">
                <button className="navbar-item" onClick={toPage("")}>
                    <p> Home</p>
                </button>
                <button className="navbar-dropdown" onClick={toPage("#2")}>
                    <div className="navbar-dropdown-header">
                        <p> About us</p>
                        <div className="navbar-dropdown-icon">
                            &lt;
                        </div>
                    </div>
                    <div className="navbar-dropdown-content">
                        <button onClick={toPage("#2.1")}>About us</button>
                        <button onClick={toPage("#2.2")}>About us</button>
                        <button onClick={toPage("#2.3")}>About us</button>    
                    </div>
                </button>
                <button className="navbar-dropdown" onClick={toPage("#3")}>
                    <div className="navbar-dropdown-header">
                        <p> Services</p>
                        <div className="navbar-dropdown-icon">
                            &lt;
                        </div>
                    </div>
                    <div className="navbar-dropdown-content">
                        <button onClick={toPage("#2.1")}>About us</button>
                        <button onClick={toPage("#2.2")}>About us</button>
                        <button onClick={toPage("#2.3")}>About us</button>    
                    </div>
                </button>
                <button className="navbar-item" onClick={toPage("#4")}>
                    <p> Contact us</p>
                </button>
                <button className="navbar-dropdown" onClick={toPage("#5")}>
                    <div className="navbar-dropdown-header">
                        <p> Blog</p>
                        <div className="navbar-dropdown-icon">
                            &lt;
                        </div>
                    </div>
                    <div className="navbar-dropdown-content">
                        <button onClick={toPage("#2.1")}>About us</button>
                        <button onClick={toPage("#2.2")}>About us</button>
                        <button onClick={toPage("#2.3")}>About us</button>    
                    </div>
                </button>
            </div>
            <button onClick={() => {toggleNavbar()}} className="burger">
                <div className="burger-line"></div>
                <div className="burger-line"></div>
                <div className="burger-line"></div>
            </button>
        </nav>
    );
}

export default Navbar;