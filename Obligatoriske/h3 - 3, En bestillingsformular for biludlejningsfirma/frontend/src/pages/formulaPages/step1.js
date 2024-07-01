import { useEffect, useState } from "react";
import './../style.css';
import customAlert from './../customAlert';
import CryptoJS from 'crypto-js';
import { getData, postData } from "./../dataToDb";

const FormulaStep1 = ({setStage, setMainOBJ, mainOBJ}) => {
    const [carClass, setCarClass] = useState([]);
    const [cars, setCars] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [selectedCar, setSelectedCar] = useState(mainOBJ.car ? mainOBJ.car.name : '');
    const [selectedCarClass, setSelectedCarClass] = useState(mainOBJ.carClass ? mainOBJ.carClass.class : '');
    const [selectedAccessories, setSelectedAccessories] = useState(mainOBJ.accessories ? mainOBJ.accessories.map(a => a.name) : []);
    const [formattedToday, setFormattedToday] = useState((new Date().toISOString().split('T')[0]));
    const [fromDate, setFromDate] = useState(mainOBJ.fromDate ? mainOBJ.fromDate : formattedToday);
    const [toDate, setToDate] = useState(mainOBJ.toDate ? mainOBJ.toDate : formattedToday);

    const handleCarClassChange = async (event) => {
        const selectedCarClassId = event.target.value;
        setSelectedCarClass(selectedCarClassId);
        const matchingCars = cars.filter(c => c.classid === selectedCarClassId);

        if (matchingCars.length > 0 && fromDate !== null && toDate !== null) {
            setSelectedCar(matchingCars[0].id);
            return;
        }
        setSelectedCar('');
    }

    const handleFromDateChange = (event) => {
        if(event.target.value > toDate)
            setToDate(event.target.value);
        setFromDate(event.target.value);
    }

    const handleToDateChange = (event) => {
        setToDate(event.target.value);
    }

    const fecthData = async () => {
        setCarClass(await getData('/api/class'))
        setAccessories(await getData('/api/accessory'))
    }

    const fetchCars = async () => {
        setCars(await getData('/api/car/avaliable/' + fromDate + '/' + toDate))
    }

    const checkData = async () => {
        if(selectedCar == undefined || selectedCarClass == undefined || selectedCar == '' || selectedAccessories == [] || fromDate == undefined || toDate == undefined){
            customAlert('Please fill in all fields')
            return
        }
        mainOBJ.totalPrice = await postData('/api/order/totalprice', mainOBJ).then(response => response.json()).then(data => data.totalPrice)
        setStage(2)
    }

    useEffect(() => {
        fecthData()
    }, [])

    useEffect(() => {
        if(fromDate != null && toDate != null){
            fetchCars()
        }
    }, [fromDate, toDate])

    useEffect(()=> {
        setMainOBJ({
            ...mainOBJ,
            car: cars.find(c => c.name === selectedCar),
            carClass: carClass.find(c => c.class === selectedCarClass),
            accessories: accessories.filter(a => selectedAccessories.includes(a.name)),
            fromDate: fromDate,
            toDate: toDate,
            totalPrice : 0
        })
    },[selectedCar, selectedCarClass, selectedAccessories, fromDate, toDate])

    return(
        <>
            <h2 className="config-title">Bilkonfiguration</h2>
            <div className="dateinput">
                <div className="dateinputdiv">
                    <label className="date-label blackText">Fra:</label>
                    <input className="date-input" type="date" min={formattedToday} value={fromDate} onChange={handleFromDateChange}/>
                </div>
                <div className="dateinputdiv">
                    <label className="date-label blackText">Til: </label>
                    <input className="date-input" type="date" min={fromDate || formattedToday} value={toDate} onChange={handleToDateChange} />
                </div>
            </div>
            <select id="carClassSelect" className="car-class-select" onChange={handleCarClassChange}>
                <option value="" hidden unselectable=''>Select a class</option>
                {carClass.map((c) => (
                    <option key={c.id} value={c.class}>
                    {c.class}
                    </option>
                ))}
            </select>
            <select id="carSelect" className="car-select" value={selectedCar} onChange={(event) => {setSelectedCar(event.target.value);}}>
                <option value="" hidden unselectable=''>Select a car</option>
                {fromDate != null && toDate != null ? cars.filter(c => c.class == selectedCarClass).map((c) => (
                    <option key={c.id} value={c.name}>
                    {c.price},- kr -- {c.name}
                    </option>
                )) : <option value='' unselectable=""> Vælg En Dato </option>}
            </select>
            <div className="accessories-container">
                {accessories.map((a) => (
                    <div key={a.id}>
                    <input type="checkbox" id={a.id} name={a.name} value={a.name} onChange={(e) => {
                        if (e.target.checked) {
                        setSelectedAccessories([...selectedAccessories, e.target.value])
                        } else {
                        setSelectedAccessories(selectedAccessories.filter(a => a !== e.target.value))
                        }
                    }} />
                    <label htmlFor={a.id}>{a.name}</label>
                    </div>
                ))}
            </div>
            <button className="next-button" onClick={() => checkData()}>Next</button>
        </>
    )
}

export default FormulaStep1;