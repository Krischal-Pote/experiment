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

  // LETTER A
  const strokes = [
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
  ];

  // LETTER B
  // const strokes = [
  //   [
  //     { x: 0.26367, y: 0.15039 },
  //     { x: 0.26563, y: 0.21289 },
  //     { x: 0.26758, y: 0.28711 },
  //     { x: 0.26953, y: 0.36719 },
  //     { x: 0.27344, y: 0.4375 },
  //     { x: 0.27344, y: 0.51953 },
  //     { x: 0.27344, y: 0.60156 },
  //     { x: 0.27539, y: 0.67578 },
  //     { x: 0.27344, y: 0.75391 },
  //     { x: 0.27344, y: 0.80859 },
  //     { x: 0.27539, y: 0.86133 },
  //   ],
  //   [
  //     { x: 0.28516, y: 0.14258 },
  //     { x: 0.34375, y: 0.14453 },
  //     { x: 0.4082, y: 0.14648 },
  //     { x: 0.47852, y: 0.14453 },
  //     { x: 0.55078, y: 0.15039 },
  //     { x: 0.61133, y: 0.16602 },
  //     { x: 0.66016, y: 0.20117 },
  //     { x: 0.69141, y: 0.25391 },
  //     { x: 0.69727, y: 0.31641 },
  //     { x: 0.6875, y: 0.375 },
  //     { x: 0.65039, y: 0.42969 },
  //     { x: 0.60742, y: 0.45898 },
  //     { x: 0.55469, y: 0.48047 },
  //     { x: 0.48633, y: 0.48438 },
  //     { x: 0.42188, y: 0.48438 },
  //     { x: 0.36914, y: 0.48438 },
  //     { x: 0.32617, y: 0.48438 },
  //   ],
  //   [
  //     { x: 0.65039, y: 0.47656 },
  //     { x: 0.69531, y: 0.5332 },
  //     { x: 0.7207, y: 0.58398 },
  //     { x: 0.73828, y: 0.64453 },
  //     { x: 0.74219, y: 0.71484 },
  //     { x: 0.71289, y: 0.78516 },
  //     { x: 0.67383, y: 0.81641 },
  //     { x: 0.61133, y: 0.84766 },
  //     { x: 0.55078, y: 0.85547 },
  //     { x: 0.47656, y: 0.85742 },
  //     { x: 0.41797, y: 0.85938 },
  //     { x: 0.36719, y: 0.85938 },
  //     { x: 0.31445, y: 0.85938 },
  //   ],
  // ];
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    setPainterSize({ width: canvas.width, height: canvas.height });
  }, []);

  const handlePanUpdate = (event) => {
    if (!isDrawing) return;
    const localPosition = getLocalPosition(event);
    if (isEligibleToStart(localPosition)) {
      setTempPoints([...tempPoints, localPosition]);
      clearTempPoints(localPosition);
      if (
        isLastIndexOfStroke(localPosition) &&
        currentStroke < strokes.length - 1
      ) {
        toast("Last Index");
        setCurrentStroke(currentStroke + 1);
      }
    }
  };

  const handlePanEnd = () => {
    if (strokes[currentStroke].isTraced) {
      setUserPoints((prev) => [
        ...prev,
        ...tempPoints,
        { x: Infinity, y: Infinity },
      ]);
      setTempPoints([]);
      if (currentStroke < strokes.length - 1) {
        setCurrentStroke(currentStroke + 1);
      }
    }
  };
  const handlePanDown = (event) => {
    if (event.button !== 0) return;
    const localPosition = getLocalPosition(event);
    setIsDrawing((prevState) => !prevState);
    if (!isDrawing) {
      setTempPoints((prevTempPoints) => [...prevTempPoints, localPosition]);
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
      return isInsideEligibleArea(strokes[currentStroke][0], pickedOffset);
    } else {
      const lastPoint = tempPoints[tempPoints.length - 1];
      return isInsideEligibleArea(lastPoint, pickedOffset);
    }
  };

  const isLastIndexOfStroke = (pickedOffset) => {
    if (tempPoints.length < 2) {
      return false;
    } else {
      const lastStrokePoint =
        strokes[currentStroke][strokes[currentStroke].length - 1];
      const lastPoint = tempPoints[tempPoints.length - 1];
      return (
        isInsideEligibleArea(lastStrokePoint, pickedOffset) &&
        isInsideEligibleArea(lastPoint, pickedOffset)
      );
    }
  };
  const clearTempPoints = (localPosition) => {
    if (!isWithinStrokes(localPosition)) {
      setTempPoints([]);
    }
  };

  const isWithinStrokes = (point) => {
    for (let stroke of strokes) {
      for (let strokePoint of stroke) {
        if (
          Math.sqrt(
            (point.x - strokePoint.x) ** 2 + (point.y - strokePoint.y) ** 2
          ) < 0.06
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "black";
    context.lineWidth = 4;

    for (let stroke of strokes) {
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
  };

  useEffect(() => {
    draw();
  }, [tempPoints, userPoints]);

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseDown={handlePanDown}
        onMouseMove={handlePanUpdate}
        onMouseUp={handlePanEnd}
        style={{ border: "1px solid black" }}
      />
      <img
        src="/A.png"
        alt="a"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      />
      <ToastContainer />
    </div>
  );
};

export default GesturePathPainter;
