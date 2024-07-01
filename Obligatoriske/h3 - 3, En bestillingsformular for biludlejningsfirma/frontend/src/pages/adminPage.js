import { useEffect, useState } from "react";
import './style.css';
import CryptoJS from 'crypto-js';
import { postData, getData } from "./dataToDb";

const AdminPage = ({ setIsLoggedIn }) => {
    const [page, setPage] = useState(0);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const loadData = async () => {
        let data = await getData('/api/order/admin');
        data.forEach(row => {
            const fromDate = new Date(row.fromdate);
            const toDate = new Date(row.todate);
            const duration = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
            row.duration = duration;
        });
        setOrders(data)
        setUsers(await getData('/api/user/admin/s'))
    }

    useEffect(() => {
        loadData();
    }, []);

    const setCurrPage = (pagenr) => {
        if(page != pagenr){
            setPage(pagenr);
        } else {
            setPage(0);
        }
    }

    const showOptions = (orderId) => {
        const divs = document.getElementById("orderstablediv").children;
        for(let i = 0; i < divs.length; i++){
            if(divs[i].id == orderId){
                divs[i].classList.toggle("hidden");
            } else {
                divs[i].classList.add("hidden");

            }
        }
    }

    const handleRowClick = (orderId) => {
        setSelectedOrderId(orderId === selectedOrderId ? null : orderId);
    };

    return (
        <>
            <div className="logoutdiv">
                <button className="logoutbutton blackText" onClick={() => {setIsLoggedIn(false); localStorage.removeItem('userid');localStorage.removeItem('role');}}>Logout</button>
            </div>
            <h1 className="whiteText">Admin page</h1>
            <div className="admin-container">
                <div className="admin-item">
                    <h2>Orders</h2>
                    <p>View all orders</p>
                    <button className="admin-button" onClick={() => { setCurrPage(1)}}>View</button>
                </div>
                <div className="admin-item">
                    <h2>Users</h2>
                    <p>View all users</p>
                    <button className="admin-button" onClick={() => {setCurrPage(2)}}>View</button>
                </div>
            </div>
            <div className="admin-table-container">
                {page === 1 && (<>
                    <div id="orderstablediv" className="admintablediv">
                        {orders.map((order) => (
                            <>
                                <div className="item" onClick={() => {showOptions(order.orderid)}}>
                                    Order: {order.orderid}
                                    <label id={order.orderid + "-"} >--</label>
                                </div>
                                <div id={order.orderid} className="moreInfo hidden">
                                    <div className="moreInfoItem">
                                        <p>Car: {order.carname}</p>
                                        <p>Accessories: {order.accessories.map(item => item).join(', ')}</p>
                                        <p>From: {new Date(order.fromdate).toLocaleDateString()}</p>
                                        <p>To: {new Date(order.fromdate).toLocaleDateString()}</p>
                                        <p>Duration: {order.duration <= 1 ? order.duration + " day" : order.duration + " days"} </p>
                                        <p>Total price: {order.totalprice},- kr</p>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                </>)}
                {page === 2 && (<>
                    <table className="admin-table">
                        <thead className="admin-table-header">
                            <tr className="admin-table-header">
                                <th className="admin-table-header-cell"> User ID</th>
                                <th className="admin-table-header-cell"> Username </th>
                                <th className="admin-table-header-cell"> Email </th>
                                <th className="admin-table-header-cell"> Address </th>
                                <th className="admin-table-header-cell"> Zipcode </th>
                                <th className="admin-table-header-cell"> City </th>
                                <th className="admin-table-header-cell"> Phone </th>
                                <th className="admin-table-header-cell"> Orders </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.userid} className="admin-table-row">
                                    <td className="admin-table-cell">{user.userid}</td>
                                    <td className="admin-table-cell">{user.username}</td>
                                    <td className="admin-table-cell">{user.email}</td>
                                    <td className="admin-table-cell">{user.address}</td>
                                    <td className="admin-table-cell">{user.zipcode}</td>
                                    <td className="admin-table-cell">{user.city}</td>
                                    <td className="admin-table-cell">{user.phone}</td>
                                    <td className="admin-table-cell">{user.order_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>)}
                {page === 3 && (<>
                    <table className="admin-table">
                        <thead className="admin-table-header">
                            <tr className="admin-table-header">
                                <th className="admin-table-header-cell"> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.userid} className="admin-table-row">
                                    <td className="admin-table-cell"> </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>)}
            </div>
        </>
    )
}

export default AdminPage;