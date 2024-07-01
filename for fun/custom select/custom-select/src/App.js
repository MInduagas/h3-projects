import './App.css';
import React, {useState, useEffect} from 'react';

function App() {
  const [car, setCar] = useState([])
  const [selectedCar, setSelectedCar] = useState('Select an option')

  const fecthData = async () => {
    let response = await fetch('http://localhost:7889/api/car/')
    let data = await response.json();
    setCar(data)
  }

  const toggleShow = () => {
    const selectItems = document.querySelector('.select-items');
    selectItems.classList.toggle('show');
  }

  const setSelect = (value) => {
    setSelectedCar(value)
    toggleShow()
  }

  useEffect(() => {
    fecthData();
  },[]) 

  return (
    <div className="container">
      <div className="form">
        <div className="custom-select">
          <div className="select-selected" onClick={() => { toggleShow()}}>{selectedCar}</div>
          <div className="select-items">
            {car.map((item, index) => (
              <div className="select-item" value={item.name} key={index} onClick={(e) => {setSelect(item.name)}}>{item.name}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;