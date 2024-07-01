import React, { useState, useEffect } from 'react';
import './../styles.css';
import { apiUrl } from '../../apiConf';

const SearchForBolcher = () => {
    const [ Bolche, setBolche ] = useState([]);
    const [ text, setText ] = useState("");
    const [farve, setFarve] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [ restrictions, setRestrictions ] = useState([]);

    const [isVisible, setIsVisible] = useState(false);

    const fetchData = async () => {
        let response;
        if(restrictions == "Color") {
            let colorString = selectedColors.join(",");
            if(colorString === "") {
                response = await fetch(apiUrl + "api/bolche/");
            } else {
                response = await fetch(apiUrl + "api/bolche/f/" + colorString);
            }
        } else {
            if(text === "") {
                response = await fetch(apiUrl + "api/bolche/");
            } else {
                if(restrictions.length === 0) {
                    response = await fetch(apiUrl + "api/bolche/t/" + text);
                } else{
                    response = await fetch(apiUrl + "api/bolche/t/" + restrictions + "," + text);
                }
            }
        }
        let data = await response.json();
        setBolche(data);
    };

    const handleColorClick = (color) => {
        if (selectedColors.includes(color)) {
            setSelectedColors(selectedColors.filter(c => c !== color));
        } else {
            setSelectedColors([...selectedColors, color]);
        }
    };

    const getColor = async () => {
        let response = await fetch(apiUrl + "api/farve/");
        let data = await response.json();
        setFarve(data);
    };

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className="bolche">
            <h2 onClick={toggleVisibility}>Search For Bolcher</h2>
            {isVisible && (<>
            <div className="bolche-color">
                {restrictions != "Color"&&(<input type="text" placeholder="Search for bolcher" onChange={(e) => setText(e.target.value)}></input>)}
                {restrictions == "Color" &&(<>
                    {farve.map((farve) => (
                    <button
                        key={farve.id}
                        onClick={() => handleColorClick(farve.farve)}
                        style={{ backgroundColor: selectedColors.includes(farve.farve) ? 'lightgreen' : '' }}
                    >
                        {farve.farve}
                    </button>
                ))}
                </>)}
            </div><br></br>
            <div>
                <input type="radio" id="Start" name="restrictions" value="Start" onChange={(e) => setRestrictions(e.target.value)}></input>
                <label for="Start">Start</label>
                <input type="radio" id="End" name="restrictions" value="End" onChange={(e) => setRestrictions(e.target.value)}></input>
                <label for="End">End</label>
                <input type="radio" id="default" name="restrictions" value="" onChange={(e) => setRestrictions(e.target.value)}></input>
                <label for="default">Default</label>
                <input type="radio" id="Color" name="restrictions" value="Color" onChange={(e) => {setRestrictions(e.target.value); getColor()}}></input>
                <label for="Color">Farver</label>
            </div>
            <button onClick={fetchData}>Hent Bolcher</button>
            <table className="bolche-table">
                <thead>
                    <tr className="bolche-header">
                        <th className="bolche-th">Bolche Navn</th>
                        <th className="bolche-th">Bolche vægt</th>
                        <th className="bolche-th">Bolche Farve</th>
                        <th className="bolche-th">Bolche Styrke</th>
                        <th className="bolche-th">Bolche Surhed</th>
                        <th className="bolche-th">Bolche Type</th>
                        <th className="bolche-th">Bolche Rovarepris</th>
                    </tr>
                </thead>
                <tbody>
                    {Bolche.map((bolche) => (
                        <tr key={bolche.id} className="bolche-row">
                            <td className="bolche-td">{bolche.navn}</td>
                            <td className="bolche-td">{bolche.vægt}</td>
                            <td className="bolche-td">{bolche.farve}</td>
                            <td className="bolche-td">{bolche.styrke}</td>
                            <td className="bolche-td">{bolche.surhed}</td>
                            <td className="bolche-td">{bolche.type}</td>
                            <td className="bolche-td">{bolche.rovarepris} ,- øre</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </>)}
        </div>
    );
}

export default SearchForBolcher;
