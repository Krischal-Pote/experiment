import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GesturePathPainter = () => {
  const canvasRef = useRef(null);
  const [userPoints, setUserPoints] = useState([]);
  const [tempPoints, setTempPoints] = useState([]);
  const [painterSize, setPainterSize] = useState({ width: 0, height: 0 });
  const [currentStroke, setCurrentStroke] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [guidePointIndex, setGuidePointIndex] = useState(0);
  const [paintingAllowed, setPaintingAllowed] = useState(true);
  const [lastPointReached, setLastPointReached] = useState(false);
  const [currentLetter, setCurrentLetter] = useState("A");

  const strokes = {
    A: [
      [
        { x: 0.47656, y: 0.13477 },
        { x: 0.44727, y: 0.19922 },
        { x: 0.41602, y: 0.26953 },
        { x: 0.39258, y: 0.32813 },
        { x: 0.36914, y: 0.39453 },
        { x: 0.34375, y: 0.45117 },
        { x: 0.32422, y: 0.50391 },
        { x: 0.30078, y: 0.55859 },
        { x: 0.27344, y: 0.625 },
        { x: 0.25586, y: 0.67383 },
        { x: 0.23633, y: 0.7207 },
        { x: 0.21484, y: 0.76563 },
        { x: 0.19141, y: 0.82617 },
        { x: 0.16797, y: 0.87891 },
      ],
      [
        { x: 0.50781, y: 0.13086 },
        { x: 0.5332, y: 0.18164 },
        { x: 0.56055, y: 0.24805 },
        { x: 0.58594, y: 0.30273 },
        { x: 0.60938, y: 0.35938 },
        { x: 0.63086, y: 0.41211 },
        { x: 0.65039, y: 0.46484 },
        { x: 0.67871, y: 0.52734 },
        { x: 0.70703, y: 0.59766 },
        { x: 0.73242, y: 0.66016 },
        { x: 0.75391, y: 0.71875 },
        { x: 0.77734, y: 0.76953 },
        { x: 0.80469, y: 0.83203 },
        { x: 0.81934, y: 0.87598 },
      ],
      [
        { x: 0.35352, y: 0.625 },
        { x: 0.41016, y: 0.625 },
        { x: 0.46875, y: 0.625 },
        { x: 0.53516, y: 0.625 },
        { x: 0.60156, y: 0.62891 },
        { x: 0.67578, y: 0.62891 },
      ],
    ],
    B: [
      [
        { x: 0.26367, y: 0.15039 },
        { x: 0.26563, y: 0.21289 },
        { x: 0.26758, y: 0.28711 },
        { x: 0.26953, y: 0.36719 },
        { x: 0.27344, y: 0.4375 },
        { x: 0.27344, y: 0.51953 },
        { x: 0.27344, y: 0.60156 },
        { x: 0.27539, y: 0.67578 },
        { x: 0.27344, y: 0.75391 },
        { x: 0.27344, y: 0.80859 },
        { x: 0.27539, y: 0.86133 },
      ],
      [
        { x: 0.28516, y: 0.14258 },
        { x: 0.34375, y: 0.14453 },
        { x: 0.4082, y: 0.14648 },
        { x: 0.47852, y: 0.14453 },
        { x: 0.55078, y: 0.15039 },
        { x: 0.61133, y: 0.16602 },
        { x: 0.66016, y: 0.20117 },
        { x: 0.69141, y: 0.25391 },
        { x: 0.69727, y: 0.31641 },
        { x: 0.6875, y: 0.375 },
        { x: 0.65039, y: 0.42969 },
        { x: 0.60742, y: 0.45898 },
        { x: 0.55469, y: 0.48047 },
        { x: 0.48633, y: 0.48438 },
        { x: 0.42188, y: 0.48438 },
        { x: 0.36914, y: 0.48438 },
        { x: 0.32617, y: 0.48438 },
      ],
      [
        { x: 0.65039, y: 0.47656 },
        { x: 0.69531, y: 0.5332 },
        { x: 0.7207, y: 0.58398 },
        { x: 0.73828, y: 0.64453 },
        { x: 0.74219, y: 0.71484 },
        { x: 0.71289, y: 0.78516 },
        { x: 0.67383, y: 0.81641 },
        { x: 0.61133, y: 0.84766 },
        { x: 0.55078, y: 0.85547 },
        { x: 0.47656, y: 0.85742 },
        { x: 0.41797, y: 0.85938 },
        { x: 0.36719, y: 0.85938 },
        { x: 0.31445, y: 0.85938 },
      ],
    ],
    C: [
      [
        { x: 0.753, y: 0.313 },
        { x: 0.699, y: 0.263 },
        { x: 0.634, y: 0.222 },
        { x: 0.542, y: 0.192 },
        { x: 0.48, y: 0.189 },
        { x: 0.404, y: 0.201 },
        { x: 0.338, y: 0.239 },
        { x: 0.284, y: 0.29 },
        { x: 0.242, y: 0.347 },
        { x: 0.213, y: 0.418 },
        { x: 0.203, y: 0.486 },
        { x: 0.206, y: 0.561 },
        { x: 0.226, y: 0.627 },
        { x: 0.252, y: 0.679 },
        { x: 0.296, y: 0.734 },
        { x: 0.351, y: 0.778 },
        { x: 0.417, y: 0.808 },
        { x: 0.488, y: 0.817 },
        { x: 0.554, y: 0.817 },
        { x: 0.606, y: 0.801 },
        { x: 0.654, y: 0.776 },
        { x: 0.687, y: 0.751 },
        { x: 0.705, y: 0.734 },
      ],
    ],
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    setPainterSize({ width: canvas.width, height: canvas.height });
  }, []);

  const handlePanUpdate = (event) => {
    if (!isDrawing) return;
    const localPosition = getLocalPosition(event);
    if (isEligibleToStart(localPosition)) {
      setTempPoints((prevTempPoints) => [...prevTempPoints, localPosition]);
    }
  };

  const handlePanEnd = () => {
    if (tempPoints.length > 0) {
      completeStroke(tempPoints[tempPoints.length - 1]);
    }
    setIsDrawing(false);
  };

  const handlePanDown = (event) => {
    if (event.button !== 0) return;
    const localPosition = getLocalPosition(event);
    setIsDrawing(true);
    setTempPoints([localPosition]);
    setPaintingAllowed(true);
  };

  const completeStroke = (lastPoint) => {
    const currentStrokePoints = strokes[currentLetter][currentStroke];
    const lastStrokePoint = currentStrokePoints[currentStrokePoints.length - 1];

    if (tempPoints.length >= 2) {
      let guidePointIndex = 0;
      let allPointsDrawn = true;

      for (let i = 0; i < tempPoints.length; i++) {
        if (
          isInsideEligibleArea(
            tempPoints[i],
            currentStrokePoints[guidePointIndex]
          )
        ) {
          guidePointIndex++;
        }
        if (guidePointIndex === currentStrokePoints.length) {
          break;
        }
      }

      if (guidePointIndex !== currentStrokePoints.length) {
        allPointsDrawn = false;
      }

      if (
        allPointsDrawn &&
        isInsideEligibleArea(lastPoint, tempPoints[tempPoints.length - 2])
      ) {
        const adjustedPoints = tempPoints.map((point) =>
          findClosestPoint(point, currentStrokePoints)
        );

        setUserPoints((prev) => [
          ...prev,
          ...adjustedPoints,
          lastStrokePoint,
          { x: Infinity, y: Infinity },
        ]);

        setTempPoints([]);
        setLastPointReached(true);
        setGuidePointIndex(0);
        setPaintingAllowed(false);

        if (currentStroke < strokes[currentLetter].length - 1) {
          setTimeout(() => {
            setCurrentStroke(currentStroke + 1);
            setLastPointReached(false);
            setPaintingAllowed(true);
          }, 500);
        } else {
          toast.success(
            `Congratulations! You completed the letter ${currentLetter}.`
          );

          if (currentLetter === "C") {
            toast.success("Congratulations! You completed all letters.");
            setTimeout(() => {
              setCurrentLetter("A");
              setCurrentStroke(0);
              setUserPoints([]);
              setGuidePointIndex(0);
              setPaintingAllowed(true);
              setLastPointReached(false);
            }, 2000);
          } else {
            setTimeout(() => {
              if (currentLetter === "A") {
                setCurrentLetter("B");
              } else if (currentLetter === "B") {
                setCurrentLetter("C");
              }
              setCurrentStroke(0);
              setUserPoints([]);
              setGuidePointIndex(0);
              setPaintingAllowed(true);
              setLastPointReached(false);
            }, 2000);
          }
        }
      } else {
        setTempPoints([]);
      }
    } else {
      setTempPoints([]);
    }
  };

  const getLocalPosition = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / painterSize.width,
      y: (event.clientY - rect.top) / painterSize.height,
    };
  };

  const isInsideEligibleArea = (o1, o2) => {
    return Math.sqrt((o1.x - o2.x) ** 2 + (o1.y - o2.y) ** 2) < 0.1;
  };

  const isEligibleToStart = (pickedOffset) => {
    if (tempPoints.length === 0 || tempPoints.length === 1) {
      return isInsideEligibleArea(
        strokes[currentLetter][currentStroke][0],
        pickedOffset
      );
    } else {
      const lastPoint = tempPoints[tempPoints.length - 1];
      return isInsideEligibleArea(lastPoint, pickedOffset);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "black";
    context.lineWidth = 4;

    context.fillStyle = "black";
    for (let stroke of strokes[currentLetter]) {
      for (let point of stroke) {
        context.beginPath();
        context.arc(
          point.x * painterSize.width,
          point.y * painterSize.height,
          10,
          0,
          2 * Math.PI
        );
        context.fill();
      }
    }

    if (!lastPointReached && guidePointIndex > 0 && !isDrawing) {
      context.strokeStyle = "lightgreen";
      context.lineWidth = 35;
      context.lineCap = "round";
      for (
        let i = 0;
        i < guidePointIndex &&
        i < strokes[currentLetter][currentStroke].length - 1;
        i++
      ) {
        const startPoint = strokes[currentLetter][currentStroke][i];
        const endPoint = strokes[currentLetter][currentStroke][i + 1];
        context.beginPath();
        context.moveTo(
          startPoint.x * painterSize.width,
          startPoint.y * painterSize.height
        );
        context.lineTo(
          endPoint.x * painterSize.width,
          endPoint.y * painterSize.height
        );
        context.stroke();
      }
    }

    context.strokeStyle = "black";
    context.lineWidth = 50;
    context.lineCap = "round";
    for (let i = 0; i < userPoints.length - 1; i++) {
      if (userPoints[i].x === Infinity || userPoints[i + 1].x === Infinity) {
        continue;
      }
      context.beginPath();
      context.moveTo(
        userPoints[i].x * painterSize.width,
        userPoints[i].y * painterSize.height
      );
      context.lineTo(
        userPoints[i + 1].x * painterSize.width,
        userPoints[i + 1].y * painterSize.height
      );
      context.stroke();
    }

    for (let i = 0; i < tempPoints.length - 1; i++) {
      context.beginPath();
      context.moveTo(
        tempPoints[i].x * painterSize.width,
        tempPoints[i].y * painterSize.height
      );
      context.lineTo(
        tempPoints[i + 1].x * painterSize.width,
        tempPoints[i + 1].y * painterSize.height
      );
      context.stroke();
    }

    if (tempPoints.length > 0) {
      const lastTempPoint = tempPoints[tempPoints.length - 1];
      context.beginPath();
      context.arc(
        lastTempPoint.x * painterSize.width,
        lastTempPoint.y * painterSize.height,
        5,
        0,
        2 * Math.PI
      );
      context.fill();
    }
  };

  useEffect(() => {
    draw();
  }, [
    tempPoints,
    userPoints,
    guidePointIndex,
    lastPointReached,
    currentLetter,
    isDrawing,
  ]);

  useEffect(() => {
    if (!lastPointReached && !isDrawing) {
      const interval = setInterval(() => {
        setGuidePointIndex(
          (prev) =>
            (prev + 1) % (strokes[currentLetter][currentStroke].length + 1)
        );
        if (
          guidePointIndex ===
          strokes[currentLetter][currentStroke].length - 1
        ) {
          setPaintingAllowed(true);
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [
    currentStroke,
    guidePointIndex,
    currentLetter,
    lastPointReached,
    isDrawing,
  ]);

  const findClosestPoint = (point, guidePoints) => {
    let closestPoint = guidePoints[0];
    let minDistance = Math.sqrt(
      (point.x - closestPoint.x) ** 2 + (point.y - closestPoint.y) ** 2
    );

    for (let guidePoint of guidePoints) {
      const distance = Math.sqrt(
        (point.x - guidePoint.x) ** 2 + (point.y - guidePoint.y) ** 2
      );

      if (distance < minDistance) {
        closestPoint = guidePoint;
        minDistance = distance;
      }
    }

    return closestPoint;
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseDown={handlePanDown}
        onMouseMove={handlePanUpdate}
        onMouseUp={handlePanEnd}
        onMouseLeave={() => setIsDrawing(false)}
        style={{ border: "1px solid black" }}
      />
      <img
        src={`/${currentLetter}.png`}
        alt={currentLetter}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          width: "500px",
          height: "500px",
        }}
      />
      <ToastContainer />
    </div>
  );
};

export default GesturePathPainter;
