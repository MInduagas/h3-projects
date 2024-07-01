import React, { useState, useEffect } from 'react';
import './../styles.css';
import { apiUrl } from '../../apiConf';

const CityAndStrengthKunder = () => {
    const [kunder, setKunder] = useState([]);
    const [postnummer, setPostnummer] = useState([]);
    const [styrke, setStyrke] = useState([]);
    const [inputPostnummer, setInputPostnummer] = useState("");
    const [inputStyrke, setInputStyrke] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const fetchData = async () => {
        let response = await fetch(apiUrl + "api/kunde/cs/" + inputPostnummer + "/" + inputStyrke);
        let data = await response.json();
        setKunder(data);
    }

    const fetchPostnummer = async () => {
        let response = await fetch(apiUrl + "api/postnummer/");
        let data = await response.json();
        setPostnummer(data);
        response = await fetch(apiUrl + "api/styrke/");
        data = await response.json();
        setStyrke(data);
    }

    const toggleVisibility = () => {
        if(!isVisible) {
            fetchPostnummer();
        }
        setIsVisible(!isVisible);
    }

    return (
        <div className="bolche">
            <h2 onClick={toggleVisibility}>City And Strength Kunder</h2>
            {isVisible && (<>
            <div>
                <select onChange={(e) => setInputPostnummer(e.target.value)}>
                    <option selected disabled hidden>Vælg By</option>
                    {postnummer.map((postnummer) => (
                        <option key={postnummer.id} value={postnummer.id}>{postnummer.postnummer} {postnummer.by}</option>
                    ))
                    }
                </select>
                <select onChange={(e) => setInputStyrke(e.target.value)}>
                    <option selected disabled hidden>Vælg Styrke</option>
                    {styrke.map((styrke) => (
                        <option key={styrke.id} value={styrke.id}>{styrke.styrke}</option>
                    ))
                    }
                </select>
                <button onClick={fetchData}>Hent Kunder</button>
            </div>
            <table className="bolche-table">
                <thead>
                    <tr className="bolche-header">
                        <th className='bolche-th'>Kunde ID</th>
                        <th className="bolche-th">Kunde Navn</th>
                        <th className="bolche-th">By</th>
                        <th className="bolche-th">Styrke</th>
                    </tr>
                </thead>
                <tbody>
                    {kunder.map((kunde) => (
                        <tr key={kunde.id} className="bolche-row">
                            <td className="bolche-td">{kunde.id}</td>
                            <td className="bolche-td">{kunde.navn}</td>
                            <td className="bolche-td">{kunde.by}</td>
                            <td className="bolche-td">{kunde.styrke}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </>)}
        </div>
    );

}

export default CityAndStrengthKunder; 