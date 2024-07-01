import React, { useState, useEffect } from 'react';
import './../styles.css';
import { apiUrl } from '../../apiConf';

const LatestOrder = () => {
    const [ordre, setOrdre] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const fetchData = async () => {
        let response = await fetch(apiUrl + "api/order/latest");
        let data = await response.json();
        setOrdre(data);
    }

    const toggleVisibility = () => {
        if(!isVisible) {
            fetchData();
        }
        setIsVisible(!isVisible);
    }

    return (
        <div className="bolche">
            <h2 onClick={toggleVisibility}>Latest Order</h2>
            {isVisible && (<>
            <table className="bolche-table">
                <thead>
                    <tr className="bolche-header">
                        <th className="bolche-th">Kunde Navn</th>
                        <th className="bolche-th">Ordre ID</th>
                        <th className="bolche-th">Ordre Dato</th>
                    </tr>
                </thead>
                <tbody>
                    {ordre.map((ordre) => (
                        <tr key={ordre.id} className="bolche-row">
                            <td className="bolche-td">{ordre.navn}</td>
                            <td className="bolche-td">{ordre.id}</td>
                            <td className="bolche-td">{new Date(ordre.orderdato).toLocaleString()}</td>
                            <td>
                            <table className="bolche-table">
                                <thead>
                                    <tr className="bolche-header">
                                        <th className="bolche-th">Navn</th>
                                        <th className="bolche-th">Antal</th>
                                        <th className="bolche-th">Rovarepris</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ordre.orderItem.map((item, index) => (
                                    <tr key={index}>
                                        <td className="bolche-td">{item.navn}</td>
                                        <td className="bolche-td">{item.antal}</td>
                                        <td className="bolche-td">{item.rovarepris} ,- øre</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </>)}
        </div>
    );
}

export default LatestOrder;