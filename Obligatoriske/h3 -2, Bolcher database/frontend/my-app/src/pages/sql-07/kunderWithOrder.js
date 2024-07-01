import React, { useState, useEffect } from 'react';
import './../styles.css';
import { apiUrl } from '../../apiConf';

const KunderWithOrder = () => {
    const [kunder, setKunder] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const fetchData = async () => {
        let response = await fetch(apiUrl + "api/kunde/orders/");
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
            <h2 onClick={toggleVisibility}>Kunder Med Order</h2>
            {isVisible && (<>
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

export default KunderWithOrder;