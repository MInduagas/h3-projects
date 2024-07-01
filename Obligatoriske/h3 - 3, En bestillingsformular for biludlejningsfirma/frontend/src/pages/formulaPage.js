import { useEffect, useState } from "react";
import './style.css';
import customAlert from './customAlert';
import CryptoJS from 'crypto-js';
import { getData, postData } from "./dataToDb";
import FormulaStep1 from "./formulaPages/step1";
import FormulaStep2 from "./formulaPages/step2";
import FormulaStep3 from "./formulaPages/step3";

const FormulaPage = ( {setIsLoggedIn}) => {
  const [stage, setStage] = useState(1)
  const [mainOBJ, setMainOBJ] = useState({
    car: [],
    carClass: [],
    accessories: [],
    fromDate: null,
    toDate: null
  })

  return (
    <>
      <div className="logoutdiv">
        <button className="logoutbutton blackText" onClick={() => {setIsLoggedIn(false); localStorage.removeItem('userid');localStorage.removeItem('role');}}>Login</button>
      </div>
      <div className="stepper">
        <div className={`step ${stage >= 1 ? 'active' : ''}`}>1</div>
        <div className="linediv">
          <div className={`line ${stage >= 2 ? 'active' : ''}`}></div>
        </div>
        <div className={`step ${stage >= 2 ? 'active' : ''}`}>2</div>
        <div className="linediv">
          <div className={`line ${stage >= 3 ? 'active' : ''}`}></div>
        </div>
        <div className={`step ${stage >= 3 ? 'active' : ''}`}>3</div>
      </div>
      <div className="">
        <div className={`car-config ${stage === 1 ? '' : 'inactive'}`}>
          <FormulaStep1 setMainOBJ={setMainOBJ} mainOBJ={mainOBJ} setStage={setStage}/>
        </div>
        <div className={`car-config ${stage === 2 ? '' : 'inactive'}`}>
          <FormulaStep2 mainOBJ={mainOBJ} setStage={setStage}/>
        </div>
        <div className={`car-config ${stage === 3 ? '' : 'inactive'}`}>
          <FormulaStep3 mainOBJ={mainOBJ} setStage={setStage}/>
        </div>
        <div className={`car-config ${stage === 4 ? '' : 'inactive'}`}>
          <h2 className="config-title">Bilkonfiguration</h2>
          <div>
          <h4 className="blackText">Tak for din ordre</h4>
          <h5 className="blackText">Du vil modtage en mail med yderligere informationer</h5>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormulaPage;