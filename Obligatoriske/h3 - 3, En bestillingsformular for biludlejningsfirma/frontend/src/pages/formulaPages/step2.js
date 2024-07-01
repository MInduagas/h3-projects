const FormulaStep2 = ({setStage, mainOBJ}) => {
    return(
        <>
        <h2 className="config-title">Bilkonfiguration</h2>
          <div>
            <h4 className='blackText'>Bil Klasse: {mainOBJ.carClass? mainOBJ.carClass.class : ''}</h4>
            <h4 className='blackText'>Bil: {mainOBJ.car ? mainOBJ.car.name : ''}</h4>
            {mainOBJ.accessories.length > 0 && <h4 className='blackText'>Tilbehør: {mainOBJ.accessories.map(a => a.name).join(', ')}</h4>}
            <h4 className='blackText'>Fra: {mainOBJ.fromDate}</h4>
            <h4 className='blackText'>Til: {mainOBJ.toDate}</h4>
            <h4 className='blackText'>Total pris: {mainOBJ.totalPrice} ,-kr</h4>
          </div>
          <div className='multipleButtons'>
            <button className="next-button" onClick={() => setStage(1)}>Back</button>
            <button className="next-button" onClick={() => setStage(3)}>Confirm</button>
          </div>
    </>)
}
export default FormulaStep2;