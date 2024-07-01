import CryptoJS from "crypto-js"
import customAlert from "./../customAlert"
import confirmAlert from "./../confirmAlert"
import { getData, postData } from "./../dataToDb"
import { useState, useEffect } from 'react'

const FromulaStep3 = ({setStage, mainOBJ}) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [zipcodes, setZipcodes] = useState([])

  const fetchZipcodes = async () => {
    setZipcodes(await getData('/api/zipcode'))
  }
  const checkEmpty = () => {
    let inputs = document.getElementsByTagName('input')
    for(let i = 0; i < inputs.length; i++){
      if(inputs[i].value == ''){
        inputs[i].style.border = '1px solid red'
      }
    }
  }
  const checkInput = (e) => {
    e.target.style.border = '1px solid #ccc'
  }

  const checkData = async () => {
    if(firstName === '' || lastName === '' || address === '' || zipcode === ''){
      customAlert('Please fill in all fields')
      checkEmpty()
      return
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
      customAlert('Please enter a valid email address');
      return;
  }
  
  const phoneRegex = /^(\+45)?\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/;
  if (!phoneRegex.test(phone)) {
      customAlert('Please enter a valid phone number');
      return;
  }
    mainOBJ.user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      address: address,
      zipcode: zipcode
    }

    let resposne = await postData('/api/order/createorder', mainOBJ)
    let data = await resposne.json()
    if(resposne.status !== 200){
      customAlert(data.message)
      return
    }
    customAlert(data.message)
    setStage(4)
  }

  

  const finishOrder = async () => {
      await checkData()
  }

  useEffect(() => {
    fetchZipcodes()
  }
  , [])
  return (
      <>
      <h2 className="config-title">Bilkonfiguration</h2>
      <form className="userRegistration" onSubmit={(event) => {event.preventDefault()}}>
        <div className="userRegistrationInputDiv">
        <label htmlFor="fname"> First Name: </label><p className="RequriedStar">*</p>
        <input type="text" id="firstname" name="firstname" placeholder="Your name.." value={firstName} onClick={(e) => {checkInput(e)}} onChange={(e) => {setFirstName(e.target.value)}}/>
        </div>
        <div className="userRegistrationInputDiv">
        <label htmlFor="lname"> Last Name: </label><p className="RequriedStar">*</p>
        <input type="text" id="lastname" name="lastname" placeholder="Your last name.." value={lastName} onClick={(e) => {checkInput(e)}} onChange={(e) => {setLastName(e.target.value)}} />
        </div>
        <div className="userRegistrationInputDiv">
        <label htmlFor="email"> Email: </label><p className="RequriedStar">*</p>
        <input type="email" id="email" name="email" placeholder="Your email.." value={email} onClick={(e) => {checkInput(e)}} onChange={(e) => {setEmail(e.target.value)}} />
        </div>
        <div className="userRegistrationInputDiv">
        <label htmlFor="phone"> Phone: </label><p className="RequriedStar">*</p>
        <input type="tel" id="phone" name="phone" placeholder="Your phone number.." value={phone} onClick={(e) => {checkInput(e)}} onChange={(e) => {setPhone(e.target.value)}}/>
        </div>
        <div className="userRegistrationInputDiv">
        <label htmlFor="address"> Address: </label><p className="RequriedStar">*</p>
        <input type="text" id="address" name="address" placeholder="Your address.." value={address} onClick={(e) => {checkInput(e)}} onChange={(e) => { setAddress(e.target.value)}}/>
        </div>
        <div className="userRegistrationInputDiv">
        <label htmlFor="zipcode"> Zipcode: </label><p className="RequriedStar">*</p>
        <select className="select123" onChange={(event) => {setZipcode(event.target.value)}}>
          <option value="" hidden unselectable=''>Select a city</option>
          {zipcodes.map((c) => (
              <option key={c.id} value={c.id}>
                  {c.zipcode} - {c.city}
              </option>
          ))}
        </select>
        </div>
        <button className="next-button" type="submit" onClick={() => {finishOrder()}}>Order</button>
      </form>
    <div className='multipleButtons'>
      <button className="next-button" onClick={() => setStage(2)}>Back</button>
    </div>
    </>
  )
}

export default FromulaStep3;