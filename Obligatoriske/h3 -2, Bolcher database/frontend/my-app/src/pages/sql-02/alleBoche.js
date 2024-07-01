import React, { useState, useEffect } from 'react';
import './../styles.css';
import { apiUrl } from '../../apiConf';

const LoadBoche = () => {
    const [bolche, setBolche] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);

    const [isVisible, setIsVisible] = useState(false);

    const fetchData = async () => {
        let response = await fetch(apiUrl + "api/bolche/");
        let data = await response.json();
        setBolche(data);
    };

    const toggleVisibility = () => {
        if(!isVisible) {
            fetchData();
        }
        setIsVisible(!isVisible);
    };

    const handleSort = (field) => {
        let direction = 'asc';
        if (sortField === field && sortDirection === 'asc') {
            direction = 'desc';
        }
        setSortField(field);
        setSortDirection(direction);
    };

    let sortedData = [...bolche];
    if (sortField !== null) {
        sortedData.sort((a, b) => {
            if (sortField === 'rovarepris') {
                const numA = Number(a[sortField]);
                const numB = Number(b[sortField]);
                return sortDirection === 'asc' ? numA - numB : numB - numA;
            } else {
                if (a[sortField] < b[sortField]) {
                    return sortDirection === 'asc' ? -1 : 1;
                }
                if (a[sortField] > b[sortField]) {
                    return sortDirection === 'asc' ? 1 : -1;
                }
                return 0;
            }
        });
    }

    return (
        <div className="bolche">
            <h2 onClick={toggleVisibility}>Alle Bolcher</h2>
            {isVisible && (<>
            <table className="bolche-table">
                <thead>
                    <tr className="bolche-header">
                        <th className="bolche-th" onClick={() => handleSort('navn')}>Bolche Navn</th>
                        <th className="bolche-th" onClick={() => handleSort('vægt')}>Bolche vægt</th>
                        <th className="bolche-th" onClick={() => handleSort('farve')}>Bolche Farve</th>
                        <th className="bolche-th" onClick={() => handleSort('styrke')}>Bolche Styrke</th>
                        <th className="bolche-th" onClick={() => handleSort('surhed')}>Bolche Surhed</th>
                        <th className="bolche-th" onClick={() => handleSort('type')}>Bolche Type</th>
                        <th className="bolche-th" onClick={() => handleSort('rovarepris')}>Bolche Rovarepris</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((bolche) => (
                        <tr key={bolche.id} className="bolche-row">
                            <td className="bolche-td">{bolche.navn}</td>
                            <td className="bolche-td">{bolche.vægt} g</td>
                            <td className="bolche-td">{bolche.farve}</td>
                            <td className="bolche-td">{bolche.styrke}</td>
                            <td className="bolche-td">{bolche.surhed}</td>
                            <td className="bolche-td">{bolche.type}</td>
                            <td className="bolche-td">{bolche.rovarepris} ,- øre</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </>
            )}
        </div>
    );
}

export default LoadBoche;