import React from 'react';
import {useState, useEffect} from 'react';
import "./fancyDivSelector.scss";

const FancyDivSelector = () => {
    const Images =[
        "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg",
        "https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1",
        "https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1",
        "https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1"
      ]

    useEffect(() => {
        const fancyDivSelector = document.querySelector(".fancyDivSelector");
        for (let i = 0; i < fancyDivSelector.children.length; i++){
            fancyDivSelector.children[i].style.backgroundImage = `url(${Images[i]})`;
            fancyDivSelector.children[i].addEventListener("mouseover", () => {hoverEffect( fancyDivSelector.children[i].dataset.corner)});
            fancyDivSelector.children[i].addEventListener("mouseout", () => {});
        }
    }, []);

    let previousCorner;

    const hoverEffect = (e) => {
        const horizontalLine = document.getElementById("horizontalLine");
        const verticalLine = document.getElementById("verticalLine");

        horizontalLine.style.display = "block";
        verticalLine.style.display = "block";

        let side;
        let prevSide;
        if(e != null){
            side = e.split(" ");
            if(previousCorner != null)
                prevSide = previousCorner.split(" ");
        } else
            return;

        console.log(side);
        console.log(prevSide);
        const isTop = side[0] === "Top";
        const isLeft = side[1] === "Left";
        const wasRight = prevSide && prevSide[1] === "Right";
        
        horizontalLine.style.top = isTop ? "0%" : "100%";
        horizontalLine.style.left = isLeft ? "0%" : "50%";

        verticalLine.style.top = isTop ? "0%" : "50%";
        verticalLine.style.left = isLeft ? "0%" : "100%";

        previousCorner = e;
    }

    return(
        <>
        <div className="fancyDivSelector">
            <div className='pictureContainer' data-corner="Top Left">
            </div>
            <div className='pictureContainer' data-corner="Top Right">
            </div>
            <div className='pictureContainer' data-corner="Bottom Left">
            </div>
            <div className='pictureContainer' data-corner="Bottom Right">
            </div>
            <div className='pictureSelector'>
                <div id="horizontalLine"></div>
                <div id="verticalLine"></div>
                <div id="selectedCorner"></div>
            </div>
        </div>
        </>
    )

};

export default FancyDivSelector;