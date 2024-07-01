import React, { useState, useEffect } from 'react';
import './../styles.css';
import { apiUrl } from '../../apiConf';

const OrderSearch = () => {
    const [kunde, setKunde] = useState([]);
    const [bolche, setBolche] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [dropdownCount, setDropdownCount] = useState([0]);
    const [selectedBolche, setSelectedBolche] = useState({});


    const fetchData = async () => {
        let response;
        if(Object.values(selectedBolche).length === 0) {
            return;
        }else{
            response = await fetch(apiUrl + "api/kunde/orders/" + [...new Set(Object.values(selectedBolche))].join(','));
        }
        let data = await response.json();
        setKunde(data);
    }

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
    }

    const addDropdown = () => {
        setDropdownCount(prevCount => [...prevCount, Date.now()]);
    };
    
    const removeDropdown = (id) => {
        setDropdownCount(prevCount => prevCount.filter(item => item !== id));
        setSelectedBolche(prev => {
            const newSelected = { ...prev };
            delete newSelected[id];
            return newSelected;
          });
    };

    return (
        <div className="bolche">
            <h2 onClick={toggleVisibility}>Order Search</h2>
            {isVisible && (<>
                <div>
                {dropdownCount.map((id) => (
                    <div key={id}>
                    <select onChange={e => {
                            if (e.target.value === '') {
                                setSelectedBolche(prev => {
                                const newSelected = { ...prev };
                                delete newSelected[id];
                                return newSelected;
                                });
                            } else {
                                setSelectedBolche(prev => ({ ...prev, [id]: e.target.value }));
                            }
                            }}>
                        <option value="">Vælg en Bolche</option>
                        {bolche.map((bolche) => (
                        <option key={bolche.id} value={bolche.navn}>
                            {bolche.navn}
                        </option>
                        ))}
                    </select>
                    <button className='remove-button' onClick={() => removeDropdown(id)}>X</button>
                    </div>
                ))}
                <button onClick={addDropdown}>Add another dropdown</button>
                </div>
                <div>Selected bolcher: {Object.values(selectedBolche).join(',')}
            </div>
            <button onClick={fetchData}>Hent</button>
            <table className="bolche-table">
                <thead>
                    <tr className="bolche-header">
                        <th className="bolche-th">Kunde Navn</th>
                        <th className="bolche-th">Order nr</th>
                        <th className="bolche-th">Dato </th>
                        <th className="bolche-th">order: </th>
                    </tr>
                </thead>
                <tbody>
                    {kunde.map((kunde) => (
                        <tr key={kunde.id} className="bolche-row">
                            <td className="bolche-td">{kunde.navn}</td>
                            <td className="bolche-td">{kunde.id}</td>
                            <td className="bolche-td">{new Date(kunde.orderdato).toLocaleString()}</td>
                            <td className="bolche-td">
                                <thead className="orderitems-header">
                                    <tr className="orderitems-header">
                                        <th className="orderitems-th">Navn</th>
                                        <th className="orderitems-th">Antal</th>
                                        <th className="orderitems-th">Rovarepris</th>
                                    </tr>
                                </thead>
                                {kunde.orderItem.map((item, index) => (
                                    
                                    <tr key={index} className='orderitems-td'>
                                        <td>{item.navn}</td>
                                        <td>{item.antal}</td>
                                        <td>{item.rovarepris} ,- øre</td>
                                    </tr>
                                )
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </>)}
        </div>
    );
}

export default OrderSearch;