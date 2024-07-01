import React, { useEffect, useState } from 'react';
import "./test.scss";

const ImgageSlider = () => {
    const images = [
        "https://plus.unsplash.com/premium_photo-1672762542894-caaa8d4f0a77?q=80&w=1971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ]

    let currImg = 0;

    const nextImage = async(step) => {
        const imageContainer = document.getElementById("imageContainer");
        currImg += step;
        if (currImg < 0) currImg = images.length - 1;
        if (currImg >= images.length) currImg = 0;
        const img = new Image();
        img.src = images[currImg];
        img.onload = async () => {
            imageContainer.innerHTML = ''; // Clear the imageContainer div
            for (let i = 0; i < 5; i++) {
                const slice = document.createElement('div');
                slice.style.backgroundImage = `url(${img.src})`;
                slice.style.backgroundPosition = `0px ${-100 * i }%`; // Position based on the size of the div
                slice.style.animation = `scaleIn 0.2s ${0.15 * i}s forwards`;
                imageContainer.appendChild(slice);
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
            // set background image to the current image and position it correctly
            imageContainer.style.backgroundImage = `url(${images[currImg]})`;
        }
        
    }

    return (
        <div className="imageSliderDiv">
            <div id="imageContainer"></div>
            <button onClick={() => {nextImage(-1)}}> &lt; </button>
            <button onClick={() => {nextImage(+1)}}> &gt; </button>
        </div>
    )
}
/**<canvas className="canvas" id="canvas"></canvas> */

export default ImgageSlider;