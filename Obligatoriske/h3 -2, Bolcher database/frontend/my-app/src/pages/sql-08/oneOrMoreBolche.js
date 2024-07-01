import React, { useState, useEffect } from 'react';
import './../styles.css';
import { apiUrl } from '../../apiConf';

const OneOrMoreBolche = () => {
    const [kunder, setKunder] = useState([]);
    const [bolche, setBolche] = useState([]);
    const [selectedBolche, setSelectedBolche] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const fetchData = async (bolche) => {
        let response;
        if(!bolche) {
            response = await fetch(apiUrl + "api/kunde/");
        } else {
            response = await fetch(apiUrl + "api/kunde/b/" + bolche);
        }
        let data = await response.json();
        setKunder(data);
    }

    const handleBolcheClick = (bolche) => {
        setSelectedBolche(bolche);
        fetchData(bolche);
    };

    const fetchBolche = async () => {
        let response = await fetch(apiUrl + "api/bolche/");
        let data = await response.json();
        setBolche(data);
    }

    const toggleVisibility = () => {
        if(!isVisible) {
            fetchBolche();
        }   
        setIsVisible(!isVisible);
    };

    return (
        <div className="bolche">
            <h2 onClick={toggleVisibility}>Kunder Med Bolche</h2>
            {isVisible && (<>
            <div>
                <select onChange={e => handleBolcheClick(e.target.value)}>
                    <option selected disabled hidden>Vælg Bolche</option>
                {bolche.map((bolche) => (
                    <option key={bolche.id} onClick={() => handleBolcheClick(bolche.id)}>{bolche.navn}</option>
                ))}
                </select>
            </div>
            <table className="bolche-table">
                <thead>
                    <tr className="bolche-header">
                        <th className='bolche-th'>Kunde ID</th>
                        <th className="bolche-th">Kunde Navn</th>
                        <th className="bolche-th">Antal Order</th>
                    </tr>
                </thead>
                <tbody>
                    {kunder.map((kunde) => (
                        <tr key={kunde.id} className="bolche-row">
                            <td className="bolche-td">{kunde.id}</td>
                            <td className="bolche-td">{kunde.navn}</td>
                            <td className="bolche-td">{kunde.order_count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </>)}
        </div>
    );


}

export default OneOrMoreBolche;