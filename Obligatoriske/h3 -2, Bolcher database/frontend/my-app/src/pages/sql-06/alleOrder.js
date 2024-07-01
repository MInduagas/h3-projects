import React, { useState, useEffect } from 'react';
import './../styles.css';
import { apiUrl } from '../../apiConf';

const AlleOrder = () => {
    const [order, setOrder] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const fetchData = async () => {
        let response = await fetch(apiUrl + "api/order/");
        let data = await response.json();
        setOrder(data);
    }

    const toggleVisibility = () => {
        if(!isVisible) {
            fetchData();
        }
        setIsVisible(!isVisible);
    }

    return (
        <div className="bolche">
            <h2 onClick={toggleVisibility}>Alle Order</h2>
            {isVisible && (<>
            <table className="bolche-table">
                <thead>
                    <tr className="bolche-header">
                        <th className="bolche-th">Order ID</th>
                        <th className="bolche-th">Kunde </th>
                        <th className="bolche-th">Dato</th>
                    </tr>
                </thead>
                <tbody>
                    {order.map((order) => (
                    <tr key={order.id} className="bolche-row" onClick={() => setSelectedOrderId(selectedOrderId === order.id ? null : order.id)}>
                        <td className="bolche-td">{order.id}</td>
                        <td className="bolche-td">{order.navn}</td>
                        <td className="bolche-td">{new Date(order.orderdato).toLocaleString()}</td>
                        {order.id === selectedOrderId && (
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
                                    {order.orderItem.map((item, index) => (
                                    <tr key={index}>
                                        <td className="bolche-td">{item.navn}</td>
                                        <td className="bolche-td">{item.antal}</td>
                                        <td className="bolche-td">{item.rovarepris} ,- øre</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>
                        )}
                    </tr>
                    ))}
                </tbody>
            </table>
            </>)}
        </div>
    );
}

export default AlleOrder;