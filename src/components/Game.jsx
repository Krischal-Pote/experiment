import React, { useEffect, useRef, useState } from "react";
import "../App.css";
const Game = () => {
  const canvasRef = useRef(null);
  const [isLetterComplete, setIsLetterComplete] = useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [letters, setLetters] = useState("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  // const [letters, setLetters] = useState(
  //   "कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहषज्ञ"
  // );

  // const [letters, setLetters] = useState("កណឈញ");
  const r = 96,
    g = 96,
    b = 96;
  const drawColor = `rgb(${r}, ${g}, ${b})`;
  let pixels = null;
  let letterpixels = null;
  let mousedown = false;
  let cx;

  const font = "Quicksand";

  useEffect(() => {
    cx = canvasRef.current.getContext("2d");
    setupCanvas();

    canvasRef.current.addEventListener("pointerdown", onmousedown);
    canvasRef.current.addEventListener("pointerup", onmouseup);
    canvasRef.current.addEventListener("pointermove", onmousemove);

    return () => {
      canvasRef.current.removeEventListener("pointerdown", onmousedown);
      canvasRef.current.removeEventListener("pointerup", onmouseup);
      canvasRef.current.removeEventListener("pointermove", onmousemove);
    };
  }, [currentLetterIndex]);

  const setupCanvas = () => {
    const c = canvasRef.current;
    c.height = 400;
    c.width = 500;
    cx.lineCap = "round";
    cx.font = `bold 350px  ${font} `;
    cx.fillStyle = "rgb(149, 149, 149)";
    cx.textBaseline = "middle";

    drawletter(letters[currentLetterIndex], "rgb(149, 149, 149)");
    pixels = cx.getImageData(0, 0, c.width, c.height);
    letterpixels = getpixelamount(149, 149, 149);
  };

  const drawletter = (letter, color) => {
    const c = canvasRef.current;
    let centerx = (c.width - cx.measureText(letter).width) / 2;
    let centery = c.height / 2;
    cx.fillStyle = color;
    cx.fillText(letter, centerx, centery);
    drawletterBorder(letter);
  };

  const drawletterBorder = (letter) => {
    const c = canvasRef.current;
    let centerx = (c.width - cx.measureText(letter).width) / 2;
    let centery = c.height / 2;
    cx.lineWidth = 2;
    cx.lineCap = "round";
    cx.strokeStyle = "#959595";
    cx.strokeText(letter, centerx, centery);
  };

  const paint = (x, y) => {
    let colour = getpixelcolour(x, y);

    // if (colour.r !== 255 || colour.g !== 255 || colour.b !== 255) {
    //   mousedown = false;
    // } else {
    cx.globalCompositeOperation = "source-atop";
    cx.strokeStyle = drawColor;
    cx.lineWidth = 44;
    cx.lineTo(x, y);
    cx.stroke();
    cx.beginPath();
    cx.moveTo(x, y);
    cx.globalCompositeOperation = "source-over";
    // }
  };

  const getpixelcolour = (x, y) => {
    let index = y * (pixels.width * 4) + x * 4;
    return {
      r: pixels.data[index],
      g: pixels.data[index + 1],
      b: pixels.data[index + 2],
      a: pixels.data[index + 3],
    };
  };

  const getpixelamount = (r, g, b) => {
    let pixels = cx.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    let all = pixels.data.length;
    let amount = 0;
    for (let i = 0; i < all; i += 4) {
      if (
        pixels.data[i] === r &&
        pixels.data[i + 1] === g &&
        pixels.data[i + 2] === b
      ) {
        amount++;
      }
    }
    return amount;
  };

  const pixelthreshold = () => {
    let paintedPixels = getpixelamount(r, g, b);
    let ratio = paintedPixels / letterpixels;

    console.log(
      `Painted Pixels: ${paintedPixels}, Letter Pixels: ${letterpixels}, Ratio: ${ratio}`
    );

    if (ratio > 0.72) {
      if (!isLetterComplete) {
        pulse();
        setTimeout(() => {
          alert("Letter fill complete!");
        }, 250);
      }
    }
  };

  const pulse = () => {
    let size = 310;

    const animatePulse = () => {
      cx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      cx.font = `bold ${size}px ${font}`;
      drawletter(letters[currentLetterIndex], "#1F8915");

      size += 2;
      if (size <= 350) {
        requestAnimationFrame(animatePulse);
      } else {
        setIsLetterComplete(true);
        moveToNextLetter();
      }
    };

    animatePulse();
  };

  const moveToNextLetter = () => {
    if (currentLetterIndex < letters.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1);
      setIsLetterComplete(false);
    } else {
      alert("All letters filled!");
    }
  };

  const onmousedown = (ev) => {
    mousedown = true;
    let x = Math.round(
      ev.clientX - canvasRef.current.getBoundingClientRect().x
    );
    let y = Math.round(
      ev.clientY - canvasRef.current.getBoundingClientRect().y
    );
    cx.beginPath();
    cx.moveTo(x, y);
    ev.preventDefault();
  };

  const onmouseup = (ev) => {
    mousedown = false;
    pixelthreshold();
    ev.preventDefault();
    cx.beginPath();
  };

  const onmousemove = (ev) => {
    if (mousedown) {
      let x = Math.round(
        ev.clientX - canvasRef.current.getBoundingClientRect().x
      );
      let y = Math.round(
        ev.clientY - canvasRef.current.getBoundingClientRect().y
      );
      paint(x, y);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <canvas
          ref={canvasRef}
          style={{
            cursor: "pointer",
          }}
        ></canvas>
      </div>
    </div>
  );
};

export default Game;
