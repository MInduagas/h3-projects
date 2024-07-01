import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import CreateBolche from './pages/createBolche';
import AlleBolche from './pages/sql-02/alleBoche';
import FarvetBolcher from './pages/sql-02/farvetBolcher';
import SearchForBolcher from './pages/sql-02/searchForBolcher';
import SortByWeightBolcher from './pages/sql-02/SortByWeightBolcher';
import RandomBolche from './pages/sql-02/randomBolche';
import SQL04 from './pages/sql-04/sql04';
import AlleKunder from './pages/sql-06/alleKunder';
import AlleOrder from './pages/sql-06/alleOrder';
import LatestOrder from './pages/sql-06/latestOrder';
import KunderWithOrder from './pages/sql-07/kunderWithOrder';
import OrderSearch from './pages/sql-07/orderSearch';
import GetKunder from './pages/sql-08/getKunder';
import OverXAntalGram from './pages/sql-08/overXAntalGram';
import OverXAntalKr from './pages/sql-08/overXAntalKr';
import OneOrMoreBolche from './pages/sql-08/oneOrMoreBolche';
import CityAndStrengthKunder from './pages/sql-08/cityAndStrengthKunder';

function App() {
  const [isSql02Visible, setSql02Visible] = useState(false);
  const [isSql03Visible, setSql03Visible] = useState(false);
  const [isSql04Visible, setSql04Visible] = useState(false);
  const [isSql06Visible, setSql06Visible] = useState(false);
  const [isSql07Visible, setSql07Visible] = useState(false);
  const [isSql08Visible, setSql08Visible] = useState(false);

  return (
    <>
      <CreateBolche />
      <h1 onClick={() => setSql02Visible(!isSql02Visible)}>SQL-02</h1>
        {isSql02Visible && (
            <>
                <AlleBolche />
                <FarvetBolcher />
                <SearchForBolcher />
                <SortByWeightBolcher/>
                <RandomBolche />
            </>
        )}
      <h1 onClick={() => setSql03Visible(!isSql03Visible)}>SQL-03</h1>
        {isSql03Visible && (
            <>
                <AlleBolche />
                <SearchForBolcher />
            </>
      )}
      <h1 onClick={() => setSql04Visible(!isSql04Visible)}>SQL-04</h1>
        {isSql04Visible && (
            <>
                <SQL04 />
            </>
      )}
      <h1 onClick={() => setSql06Visible(!isSql06Visible)}>SQL-06</h1>
        {isSql06Visible && (
            <>
                <AlleKunder />
                <AlleOrder />
                <LatestOrder />
            </>
      )}
      <h1 onClick={() => setSql07Visible(!isSql07Visible)}>SQL-07</h1>
        {isSql07Visible && (
            <>
              <KunderWithOrder/>
              <OrderSearch/>
            </>
      )}
      <h1 onClick={() => setSql08Visible(!isSql08Visible)}>SQL-08</h1>
        {isSql08Visible && (
            <>
              <GetKunder/>
              <OverXAntalGram/>
              <OverXAntalKr/>
              <KunderWithOrder/>
              <OneOrMoreBolche/>
              <CityAndStrengthKunder/>  
            </>
      )}
    </>
  );
}

export default App;
