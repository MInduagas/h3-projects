import React, { useState, useEffect } from 'react';
import './../styles.css';
import { apiUrl } from '../../apiConf';

const RandomBolche = () => {
    const [bolche, setBolche] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const fetchData = async () => {
        let response = await fetch(apiUrl + "api/bolche/random/");
        let data = await response.json();
        setBolche(data);
    }

    const toggleVisibility = () => {
        if(!isVisible) {
            fetchData();
        }
        setIsVisible(!isVisible);
    }

    return (
        <div className="bolche">
            <h2 onClick={toggleVisibility}>Random Bolche</h2>
            {isVisible && (<>
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
                        <tr key={bolche.id}>
                            <td className="bolche-td">{bolche.navn}</td>
                            <td className="bolche-td">{bolche.vægt}</td>
                            <td className="bolche-td">{bolche.farve}</td>
                            <td className="bolche-td">{bolche.styrke}</td>
                            <td className="bolche-td">{bolche.surhed}</td>
                            <td className="bolche-td">{bolche.type}</td>
                            <td className="bolche-td">{bolche.rovarepris}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </>)}
        </div>
    );
}

export default RandomBolche;