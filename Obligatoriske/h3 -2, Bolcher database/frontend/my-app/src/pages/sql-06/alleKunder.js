import React, { useState, useEffect } from 'react';
import './../styles.css';
import { apiUrl } from '../../apiConf';

const AlleKunder = () => {
    const [kunder, setKunder] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const fetchData = async () => {
        let response = await fetch(apiUrl + "api/kunde/");
        let data = await response.json();
        setKunder(data);
    }

    const toggleVisibility = () => {
        if(!isVisible) {
            fetchData();
        }
        setIsVisible(!isVisible);
    }

    return (
        <div className="bolche">
            <h2 onClick={toggleVisibility}>Alle Kunder</h2>
            {isVisible && (<>
            <table className="bolche-table">
                <thead>
                    <tr className="bolche-header">
                        <th className="bolche-th">Kunde Navn</th>
                        <th className="bolche-th">Kunde Email</th>
                        <th className="bolche-th">Kunde Adresse</th>
                        <th className="bolche-th">Kunde Postnr</th>
                        <th className="bolche-th">Kunde By</th>
                    </tr>
                </thead>
                <tbody>
                    {kunder.map((kunde) => (
                        <tr key={kunde.id} className="bolche-row">
                            <td className="bolche-td">{kunde.navn}</td>
                            <td className="bolche-td">{kunde.email}</td>
                            <td className="bolche-td">{kunde.adrasse}</td>
                            <td className="bolche-td">{kunde.postnummer}</td>
                            <td className="bolche-td">{kunde.by}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </>)}
        </div>
    );
}

export default AlleKunder;