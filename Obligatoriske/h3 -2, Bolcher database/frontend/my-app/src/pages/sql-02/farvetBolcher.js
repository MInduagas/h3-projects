import React, { useState, useEffect } from 'react';
import './../styles.css';
import { apiUrl } from '../../apiConf';

const FarvetBolcher = () => {
    const [bolche, setBolche] = useState([]);
    const [farve, setFarve] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [isExcluded, setIsExcluded] = useState(false);

    const handleColorClick = (color) => {
        if (selectedColors.includes(color)) {
            setSelectedColors(selectedColors.filter(c => c !== color));
        } else {
            setSelectedColors([...selectedColors, color]);
        }
    };

    const [isVisible, setIsVisible] = useState(false);

    const fetchData = async () => {
        let colorString = selectedColors.join(",");
        let response;
        if(colorString === "") {
            response = await fetch(apiUrl + "api/bolche/");
        } else if(isExcluded) {
            response = await fetch(apiUrl + "api/bolche/fn/" + colorString);
        } else {
            response = await fetch(apiUrl + "api/bolche/f/" + colorString);
        }
        let data = await response.json();
        setBolche(data);
    };

    const getColor = async () => {
        let response = await fetch(apiUrl + "api/farve/");
        let data = await response.json();
        setFarve(data);
    };

    const toggleVisibility = () => {
        if(!isVisible){
            getColor();
        }
        setIsVisible(!isVisible);
    };

    return (
        <div className="bolche">
            <h2 onClick={toggleVisibility}>Farvet Bolcher</h2>
            {isVisible && (<>
            <div className="bolche-color">
                {farve.map((farve) => (
                    <button
                        key={farve.id}
                        onClick={() => handleColorClick(farve.farve)}
                        style={{ backgroundColor: selectedColors.includes(farve.farve) ? 'lightgreen' : '' }}
                    >
                        {farve.farve}
                    </button>
                ))}
            </div><br></br>
            <button onClick={() => !isExcluded ? setIsExcluded(true) : setIsExcluded(false)}>{!isExcluded ? "Inkludere" : "Exkludere"}</button>
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
                    {bolche.map((bolche) => (
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

export default FarvetBolcher;