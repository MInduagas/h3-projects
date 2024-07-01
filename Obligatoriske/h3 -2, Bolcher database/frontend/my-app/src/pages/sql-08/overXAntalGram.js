import React, { useState, useEffect } from 'react';
import './../styles.css';
import { apiUrl } from '../../apiConf';

const OverXAntalGram = () => {
    const [kunder, setKunder] = useState([]);
    const [orders, setOrders] = useState([]);
    const [number, setNumber] = useState(0);

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    }

    const fetchData = async () => {
        let response = await fetch(apiUrl + "api/order/v/" + number);
        let data = await response.json();
        setKunder(data);
    }

    return (
        <div className="bolche">
            <h2 onClick={toggleVisibility}>Kunder Med Order over x antal gram</h2>
            {isVisible && (<>
                <input type="number" value={number} onChange={e => setNumber(e.target.value)} /><label> Gram   </label>
                <button onClick={fetchData}>Hent</button>
                <table className="bolche-table">
                    <thead>
                        <tr className="bolche-header">
                            <th className="bolche-th">Kunde Navn</th>
                            <th className='bolche-th'>Order ID</th>
                            <th className="bolche-th">Gram Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kunder.map((kunde) => (
                            <tr key={kunde.id} className="bolche-row">
                                <td className="bolche-td">{kunde.navn}</td>
                                <td className='bolche-td'>{kunde.orderid}</td>
                                <td className="bolche-td">{kunde.total_weight} Gram</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>)}
        </div>
    );
}

export default OverXAntalGram;