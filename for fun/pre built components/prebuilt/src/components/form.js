import React from "react";
import {useState, useEffect} from "react";
import "./style.scss";

const Form = () => {
    return(
        <>
            <form className="Form"> 
                <div className="Form-Content">
                    <div className="Form-Item">
                        <label className="Label" for="name">First Name</label>
                        <input className="Input" type="text" id="name" name="name" placeholder="First name.." />
                    </div>
                    <div className="Form-Item">
                        <label className="Label" for="name">Last Name</label>
                        <input className="Input" type="text" id="name" name="name" placeholder="Last name.." />
                    </div>
                    <div className="Form-Item">
                        <label className="Label" for="name">Email Adress</label>
                        <input className="Input" type="text" id="name" name="name" placeholder="Email Adress.." />
                    </div>
                    <div className="Form-Item">
                        <label className="Label" for="name">Phone Number</label>
                        <input className="Input" type="text" id="name" name="name" placeholder="Phone Number.." />
                    </div>
                    <div className="Form-Item">
                        <label className="Label" for="name">Street Name</label>
                        <input className="Input" type="text" id="name" name="name" placeholder="Street name.." />
                    </div>
                    <div className="Form-Item">
                        <label className="Label" for="name">House Number</label>
                        <input className="Input" type="text" id="name" name="name" placeholder="House Number.." />
                    </div>
                    <div className="Form-Item">
                        <label className="Label" for="name">City</label>
                        <input className="Input" type="text" id="name" name="name" placeholder="City.." />
                    </div>
                    <div className="Form-Item">
                        <label className="Label" for="name">Postal code</label>
                        <input className="Input" type="text" id="name" name="name" placeholder="Postal code.." />
                    </div>
                    
                </div>
                <div className="Form-Buttons">
                    <button className="Form-Button">Submit</button>
                    <button className="Form-Button">Cancel</button>
                </div>
            </form>
        </>
    )
}

export default Form;