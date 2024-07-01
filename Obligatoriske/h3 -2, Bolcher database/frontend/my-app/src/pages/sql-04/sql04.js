import React, { useState, useEffect } from 'react';
import './../styles.css';
import { apiUrl } from '../../apiConf';

const SQL04 = () => {
    const [bolche, setBolche] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const fetchData = async () => {
        let response = await fetch(apiUrl + "api/bolche/sql4/");
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
            <h2 onClick={toggleVisibility}>SQL04</h2>
            {isVisible && (<>
            <table className="bolche-table">
                <thead>
                    <tr className="bolche-header">
                        <th className="bolche-th">Bolche Navn</th>
                        <th className="bolche-th">Bolche vægt</th>
                        <th className="bolche-th">Bolche Rovarepris</th>
                        <th className="bolche-th">Bolche Nettopris</th>
                        <th className="bolche-th">Bolche Salgspris</th>
                        <th className="bolche-th">Bolche salgspris pr. 100g</th>
                    </tr>
                </thead>
                <tbody>
                    {bolche.map((bolche) => (
                        <tr key={bolche.id} className="bolche-row">
                            <td className="bolche-td">{bolche.navn}</td>
                            <td className="bolche-td">{bolche.vægt} g</td>
                            <td className="bolche-td">{bolche.rovarepris} ,- øre</td>
                            <td className="bolche-td">{bolche.nettopris} ,- øre</td>
                            <td className="bolche-td">{bolche.salgspris} ,- øre</td>
                            <td className="bolche-td">{bolche.salgsprisPer100Grams} ,- øre</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </>)}
        </div>
    );
}

export default SQL04;