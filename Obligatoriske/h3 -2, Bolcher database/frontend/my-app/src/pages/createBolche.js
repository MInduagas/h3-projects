import React, { useState, useEffect } from 'react';
import './styles.css';
import { apiUrl } from '../apiConf';

const CreateBolche = () => {
    const [farve, setFarve] = useState([]);
    const [styrke, setStyrke] = useState([]);
    const [surhed, setSurhed] = useState([]);
    const [type, setType] = useState([]);
    const [inputFarve, setInputFarve] = useState("");
    const [inputStyrke, setInputStyrke] = useState("");
    const [inputSurhed, setInputSurhed] = useState("");
    const [inputType, setInputType] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    useEffect(() => {
        const fetchData = async () => {
            let response = await fetch(apiUrl + "api/farve/");
            let data = await response.json();
            setFarve(data);
            response = await fetch(apiUrl + "api/styrke/");
            data = await response.json();
            setStyrke(data);
            response = await fetch(apiUrl + "api/surhed/");
            data = await response.json();
            setSurhed(data);
            response = await fetch(apiUrl + "api/type/");
            data = await response.json();
            setType(data);
            setInputFarve(data[0].id);
            setInputStyrke(data[0].id);
            setInputSurhed(data[0].id);
            setInputType(data[0].id);
        };
        fetchData();
    }, []); 

    const postBolche = async (e) => {
        e.preventDefault();
        const bolche = {
            navn: e.target.elements[0].value,
            vægt: e.target.elements[1].value,
            farve: inputFarve,
            styrke: inputStyrke,
            surhed: inputSurhed,
            type: inputType,
            rovarepris: e.target.elements[6].value
        };
        let response = await fetch(apiUrl + "api/bolche/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bolche)
        });
        console.log(response.status);
    }

    return ( 
        <div className="create">
            <h2 onClick={toggleVisibility}>Create a new Bolche</h2>

            {isVisible && (<form onSubmit={postBolche}>
                <label>Bolche Navn:</label>
                <input type="text" required /><br/>
                <label>Bolche Vægt i gram:</label>
                <input type="text" pattern="[0-9]*[.]?[0-9]*" required />   <br/>
                <label>Bolche Farve:</label>
                <select onChange={(e) => setInputFarve(e.target.value)} required>
                    {farve.map((farve) => (
                        <option key={farve.id} value={farve.id}>{farve.farve}</option>
                    ))}
                </select><br/>
                <label>Bolche Styrke:</label>
                <select onChange={(e) => setInputStyrke(e.target.value)} required>
                    {styrke.map((styrke) => (
                        <option key={styrke.id} value={styrke.id}>{styrke.styrke}</option>
                    ))}
                </select><br/>
                <label>Bolche Surhed:</label>
                <select onChange={(e) => setInputSurhed(e.target.value)} required>
                    {surhed.map((surhed) => (
                        <option key={surhed.id} value={surhed.id}>{surhed.surhed}</option>
                    ))}
                </select ><br/>
                <label>Bolche Type:</label>
                <select onChange={(e) => setInputType(e.target.value)} required>
                    {type.map((type) => (
                        <option key={type.id} value={type.id}>{type.type}</option>
                    ))}
                </select><br/>
                <label>Rå Vare Pris:</label>
                <input type="text" pattern="[0-9]*[.]?[0-9]*" required /><br/>
                <button>Create</button>
            </form>
              )}
        </div>
     );
}

export default CreateBolche;