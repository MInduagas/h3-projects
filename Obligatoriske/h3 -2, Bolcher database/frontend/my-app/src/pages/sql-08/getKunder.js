import React, { useState, useEffect } from 'react';
import './../styles.css';
import { apiUrl } from '../../apiConf';

const GetKunder = () => {
    const [kunder, setKunder] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedKunde, setSelectedKunde] = useState([]);

    const fetchData = async () => {
        let response = await fetch(apiUrl + "api/kunde/");
        let data = await response.json();
        setKunder(data);
    }

    const fetchOrders = async (id) => {
        let response = await fetch(apiUrl + "api/order/k/" + id);
        let data = await response.json();
        setOrders(data);
    }

    const toggleVisibility = () => {
        if(!isVisible) {
            fetchData();
        }
        setIsVisible(!isVisible);
    }

    return (
        <div className="bolche">
            <h2 onClick={toggleVisibility}>Hent Order for Kunder</h2>
            {isVisible && (<>
                <select onChange={(e) => fetchOrders(e.target.value)}>
                    <option value="">Vælg en kunde</option>
                    {kunder.map((kunde) => (
                        <option key={kunde.id} value={kunde.id}>{kunde.id}: {kunde.navn}</option>
                    ))}
                </select>
            <table className="bolche-table">
                <thead>
                    <tr className="bolche-header">
                        <th className="bolche-th">Order ID</th>
                        <th className="bolche-th">Order Dato</th>
                        <th className="bolche-th">Order: </th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="bolche-row">
                            <td className="bolche-td">{order.id}</td>
                            <td className="bolche-td">{new Date(order.orderdato).toLocaleString()}</td>
                            <td className="bolche-td">
                                <table className="bolche-table">
                                    <thead>
                                        <tr className="bolche-header">
                                            <th className="bolche-th">Navn</th>
                                            <th className="bolche-th">Antal</th>
                                            <th className="bolche-th">Rovarepris</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.order_items.map((item, index) => (
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

export default GetKunder;