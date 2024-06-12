import React, { useState, useRef } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";
import { toast } from "react-toastify";

class MyOffsetModel {
  offsetList: Array<{ x: number; y: number }>;
  isTraced: boolean;

  constructor(points: Array<{ x: number; y: number }>) {
    this.offsetList = points;
    this.isTraced = false;
  }
}

const strokes = [
  new MyOffsetModel([
    { x: 0.481429, y: 0.04415 },
    { x: 0.446429, y: 0.08415 },
    { x: 0.422619, y: 0.136438 },
    { x: 0.399802, y: 0.196895 },
    { x: 0.374008, y: 0.257353 },
    { x: 0.350198, y: 0.316993 },
    { x: 0.323413, y: 0.375817 },
    { x: 0.292659, y: 0.43219 },
    { x: 0.265873, y: 0.487745 },
    { x: 0.242063, y: 0.538399 },
    { x: 0.210317, y: 0.591503 },
    { x: 0.189484, y: 0.639706 },
    { x: 0.162698, y: 0.691993 },
    { x: 0.131944, y: 0.744281 },
  ]),
  new MyOffsetModel([
    { x: 0.481429, y: 0.04415 },
    { x: 0.53373, y: 0.085784 },
    { x: 0.55754, y: 0.138072 },
    { x: 0.580357, y: 0.198529 },
    { x: 0.607143, y: 0.257353 },
    { x: 0.637897, y: 0.31781 },
    { x: 0.66369, y: 0.375817 },
    { x: 0.695437, y: 0.435458 },
    { x: 0.719246, y: 0.49183 },
    { x: 0.75, y: 0.552288 },
    { x: 0.774802, y: 0.610294 },
    { x: 0.806548, y: 0.669118 },
    { x: 0.831349, y: 0.727941 },
  ]),
  new MyOffsetModel([
    { x: 0.387897, y: 0.383987 },
    { x: 0.462302, y: 0.386438 },
    { x: 0.527778, y: 0.387255 },
    { x: 0.605159, y: 0.385621 },
  ]),
];
// const strokes = [
//   new MyOffsetModel([
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
//   ]),
//   new MyOffsetModel([
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
//   ]),
//   new MyOffsetModel([
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
//   ]),
// ];
const toleranceArea = 0.1;

export const LetterTracing: React.FC = () => {
  const [userPoints, setUserPoints] = useState<Array<{ x: number; y: number }>>(
    []
  );
  const [currentStroke, setCurrentStroke] = useState(0);
  const [tempPoints, setTempPoints] = useState<Array<{ x: number; y: number }>>(
    []
  );
  const stageRef = useRef(null);

  const isInsideEligibleArea = (
    o1: { x: number; y: number },
    o2: { x: number; y: number }
  ) => {
    const distance = Math.sqrt((o1.x - o2.x) ** 2 + (o1.y - o2.y) ** 2);
    return distance < toleranceArea;
  };

  const isEligibleToStart = (pickedOffset: { x: number; y: number }) => {
    if (tempPoints.length === 0 || tempPoints.length === 1) {
      return isInsideEligibleArea(
        strokes[currentStroke].offsetList[0],
        pickedOffset
      );
    } else {
      const lastPoint = tempPoints[tempPoints.length - 1];
      return isInsideEligibleArea(lastPoint, pickedOffset);
    }
  };

  const isLastIndexOfStroke = (pickedOffset: { x: number; y: number }) => {
    if (tempPoints.length < 2) {
      return false;
    } else {
      const lastPoint =
        strokes[currentStroke].offsetList[
          strokes[currentStroke].offsetList.length - 1
        ];
      const distance = Math.sqrt(
        (pickedOffset.x - lastPoint.x) ** 2 +
          (pickedOffset.y - lastPoint.y) ** 2
      );
      return distance < toleranceArea;
    }
  };

  const handlePan = (e: any) => {
    const stage = stageRef.current as any;
    const point = stage.getPointerPosition();
    const stageWidth = stage.width();
    const stageHeight = stage.height();

    const dx = point.x / stageWidth;
    const dy = point.y / stageHeight;

    if (isEligibleToStart({ x: dx, y: dy })) {
      setTempPoints((prev) => [...prev, { x: point.x, y: point.y }]);
      if (isLastIndexOfStroke({ x: dx, y: dy })) {
        strokes[currentStroke].isTraced = true;
        toast("Touch Last Point");
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

  const resetDrawing = () => {
    setUserPoints([]);
    setCurrentStroke(0);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 100}
        onMouseDown={handlePan}
        onTouchStart={handlePan}
        onMouseMove={handlePan}
        onTouchMove={handlePan}
        onMouseUp={handlePanEnd}
        onTouchEnd={handlePanEnd}
        ref={stageRef}
      >
        <Layer>
          {strokes[currentStroke]?.offsetList.map((point, i) => (
            <Circle
              key={i}
              x={point.x * window.innerWidth}
              y={point.y * (window.innerHeight - 100)}
              radius={5}
              fill="grey"
            />
          ))}
          <Line
            points={userPoints.flatMap((point) => [point.x, point.y])}
            stroke="black"
            strokeWidth={4}
          />
        </Layer>
      </Stage>
      <button
        onClick={resetDrawing}
        style={{ position: "absolute", top: 10, right: 10, fontSize: 20 }}
      >
        Refresh
      </button>
    </div>
  );
};
