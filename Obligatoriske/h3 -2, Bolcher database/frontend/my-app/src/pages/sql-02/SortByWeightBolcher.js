import React, { useState, useEffect } from 'react';
import './../styles.css';
import { apiUrl } from '../../apiConf';

const SortByWeightBolcher = () => {
    const [ Bolche, setBolche ] = useState([]);
    const [ number, setNumber ] = useState(0);
    const [ number2, setNumber2 ] = useState(0);
    const [ restrictions, setRestrictions ] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const fetchData = async () => { 
        let response; 
        console.log(number)
        console.log(number2)
        if(number == 0) {
            response = await fetch(apiUrl + "api/bolche/");
        } else if(restrictions == "Between") {
            response = await fetch(apiUrl + "api/bolche/vm/" + number + "," + number2);
        } else if (restrictions == "Biggest" || restrictions == "Smallest") {
            response = await fetch(apiUrl + "api/bolche/vz/" + restrictions + "," + number);
        } else {
            response = await fetch(apiUrl + "api/bolche/v/" + restrictions + "," + number);
        } 
        let data = await response.json();
        setBolche(data);
    }

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    }

    return (
        <div className="bolche">
            <h2 onClick={toggleVisibility}>Sort By Weight Bolcher</h2>
            {isVisible && (<>
            <div className="bolche-color">
                <input type="number" placeholder="Search" onChange={(e) => setNumber(e.target.value)}></input>
                {restrictions === "Between" &&(<input type="number" placeholder="Search" onChange={(e) => setNumber2(e.target.value)}></input>)}
            </div><br></br>
            <div>
                <input type="radio" id="Less" name="restrictions" value="Less" onChange={(e) => setRestrictions(e.target.value)}></input>
                <label for="Less">Mindre end</label>
                <input type="radio" id="More" name="restrictions" value="More" onChange={(e) => setRestrictions(e.target.value)}></input>
                <label for="More">Mere end</label>
                <input type="radio" id="Between" name="restrictions" value="Between" onChange={(e) => setRestrictions(e.target.value)}></input>
                <label for="Between">Mellem</label>
                <input type="radio" id="Biggest" name="restrictions" value="Biggest" onChange={(e) => setRestrictions(e.target.value)}></input>
                <label for="Biggest">Største</label>
                <input type="radio" id="Smallest" name="restrictions" value="Smallest" onChange={(e) => setRestrictions(e.target.value)}></input>
                <label for="Smallest">Mindste</label>
                <input type="radio" id="default" name="restrictions" value="" onChange={(e) => setRestrictions(e.target.value)}></input>
                <label for="default">Default</label>
            </div>
            <button onClick={fetchData}>Hent Bolcher</button>
            <table className="bolche-table">
                <thead>
                    <tr className="bolche-header">
                        <th className="bolche-th">Bolche Navn</th>
                        <th className="bolche-th">Bolche vægt</th>
                        <th className="bolche-th">Bolche Farve</th>
                        <th className="bolche-th">Bolche Styrke</th>
                        <th className="bolche-th">Bolche Surhed</th>
                        <th className="bolche-th">Bolche Type</th>
                        <th className="bolche-th">Bolche Rovarepris</th>
                    </tr>
                </thead>
                <tbody>
                    {Bolche.map((bolche) => (
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
            </>)}
        </div>
    );
}

export default SortByWeightBolcher;