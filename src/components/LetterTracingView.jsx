import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { Stage, Layer, Line, Circle, Image as KonvaImage } from "react-konva";
import useImage from "use-image";

const Container = styled.div`
  position: relative;
`;

const RefreshButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  font-size: 24px;
`;

const HintImage = styled.img`
  position: absolute;
  height: 80px;
  width: 80px;
  z-index: 5;
`;

const LetterTracingView = ({
  strokes,
  toleranceArea = 0.05,
  viewSize,
  imagePath,
}) => {
  const [userPoints, setUserPoints] = useState([]);
  const [tempPoints, setTempPoints] = useState([]);
  const [currentStroke, setCurrentStroke] = useState(0);
  const [hintAnimatedPoints, setHintAnimatedPoints] = useState([]);
  const [timerCounter, setTimerCounter] = useState(0);
  const [image] = useImage(imagePath);
  const stageRef = useRef();

  const strokeWidth = 20.0;
  const lastOffsetsDistThreshHold = 0.05;

  useEffect(() => {
    startStopTimer();
    return () => {
      cancelTimer();
    };
  }, []);

  const startStopTimer = useCallback(() => {
    const timer = setInterval(() => {
      try {
        const currentStrokePoints = strokes[currentStroke].offsetList;
        const currentOffset = currentStrokePoints[timerCounter];
        const dx = currentOffset.dx * viewSize.width;
        const dy = currentOffset.dy * viewSize.height;
        const addedOffset = { x: dx, y: dy };
        setHintAnimatedPoints((prev) => [...prev, addedOffset]);
        setTimerCounter((prev) => prev + 1);
      } catch (e) {
        if (e instanceof RangeError) {
          cancelTimer();
        }
      }
    }, 100);

    return () => clearInterval(timer);
  }, [currentStroke, timerCounter, strokes, viewSize]);

  const cancelTimer = () => {
    setHintAnimatedPoints([]);
    setTimerCounter(0);
  };

  const clearTracing = () => {
    setUserPoints([]);
    setTimerCounter(0);
    setCurrentStroke(0);
    startStopTimer();
    strokes.forEach((stroke) => {
      stroke.isTraced = false;
    });
  };

  const handlePanUpdate = (e) => {
    const stage = stageRef.current;
    const localPosition = stage.getPointerPosition();
    const dy = localPosition.y / viewSize.height;
    const dx = localPosition.x / viewSize.width;
    if (isLastIndexOfStroke({ x: dx, y: dy })) {
      strokes[currentStroke].isTraced = true;
    }
    if (strokes[currentStroke].isTraced) {
      strokes[currentStroke].isTraced = true;
      return;
    } else {
      if (isEligibleToStart({ x: dx, y: dy })) {
        setTempPoints((prev) => [...prev, localPosition]);
        calculateMinDistance({ x: dx, y: dy });
        checkAndClearTempPoints({ x: dx, y: dy });
      }
    }
  };

  const handlePanEnd = () => {
    if (strokes[currentStroke].isTraced) {
      setUserPoints((prev) => [
        ...prev,
        ...strokes[currentStroke].offsetList.map((point) => ({
          x: point.dx * viewSize.width,
          y: point.dy * viewSize.height,
        })),
        { x: Infinity, y: Infinity },
      ]);
      clearTempPoints();
      if (currentStroke < strokes.length - 1) {
        setCurrentStroke((prev) => prev + 1);
      }
    } else {
      clearTempPoints();
    }
    setUserPoints((prev) => [...prev, { x: Infinity, y: Infinity }]);
    if (!strokes[strokes.length - 1].isTraced) {
      startStopTimer();
    }
  };

  const isLastIndexOfStroke = (pickedOffset) => {
    if (tempPoints.length < 2) {
      return false;
    } else {
      const lastStrokePoint = strokes[currentStroke].offsetList.slice(-1)[0];
      const calculatedDistance = calculateDistance(
        pickedOffset,
        lastStrokePoint
      );
      return calculatedDistance <= lastOffsetsDistThreshHold;
    }
  };

  const isEligibleToStart = (pickedOffset) => {
    if (tempPoints.length === 0 || tempPoints.length === 1) {
      return isInsideEligibleArea(
        strokes[currentStroke].offsetList[0],
        pickedOffset
      );
    } else {
      const lastPoint = tempPoints.slice(-1)[0];
      return isInsideEligibleArea(
        { x: lastPoint.x / viewSize.width, y: lastPoint.y / viewSize.height },
        pickedOffset
      );
    }
  };

  const isInsideEligibleArea = (o1, o2) => {
    return calculateDistance(o1, o2) < toleranceArea;
  };

  const calculateMinDistance = (pickedOffset) => {
    let minDistance = Infinity;
    strokes[currentStroke].offsetList.forEach((definedOffset) => {
      const calculatedDistance = calculateDistance(definedOffset, pickedOffset);
      if (calculatedDistance < minDistance) {
        minDistance = calculatedDistance;
      }
    });
    return minDistance;
  };

  const calculateDistance = (a, b) => {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
  };

  const checkAndClearTempPoints = (localPosition) => {
    const calculatedMinDistance = calculateMinDistance(localPosition);
    const isOutOfPoints = calculatedMinDistance >= toleranceArea;
    if (!isWithinStrokes(localPosition) || isOutOfPoints) {
      clearTempPoints();
    }
  };

  const isWithinStrokes = (point) => {
    for (const stroke of strokes.map((e) => e.offsetList)) {
      for (const strokePoint of stroke) {
        if (
          calculateDistance(point, strokePoint) * 100 < strokeWidth ||
          strokes[currentStroke].isTraced
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const clearTempPoints = () => {
    setTempPoints([]);
    setHintAnimatedPoints([]);
    setTimerCounter(0);
  };

  return (
    <Container>
      <Stage
        width={viewSize.width}
        height={viewSize.height}
        onMouseMove={handlePanUpdate}
        onTouchMove={handlePanUpdate}
        onMouseUp={handlePanEnd}
        onTouchEnd={handlePanEnd}
        ref={stageRef}
      >
        <Layer>
          <KonvaImage
            image={image}
            width={viewSize.width}
            height={viewSize.height}
          />
          {strokes[currentStroke].offsetList.map((point, index) => (
            <Circle
              key={index}
              x={point.dx * viewSize.width}
              y={point.dy * viewSize.height}
              radius={8}
              fill="grey"
              opacity={0.9}
            />
          ))}
          {hintAnimatedPoints.map((point, index) => (
            <Line
              key={index}
              points={[
                point.x,
                point.y,
                hintAnimatedPoints[index + 1]?.x || point.x,
                hintAnimatedPoints[index + 1]?.y || point.y,
              ]}
              stroke="grey"
              strokeWidth={60}
              lineCap="round"
              opacity={0.4}
            />
          ))}
          {userPoints.map((point, index) => (
            <Line
              key={index}
              points={[
                point.x,
                point.y,
                userPoints[index + 1]?.x || point.x,
                userPoints[index + 1]?.y || point.y,
              ]}
              stroke="black"
              strokeWidth={40}
              lineCap="round"
            />
          ))}
        </Layer>
      </Stage>
      <RefreshButton onClick={clearTracing}>⟲</RefreshButton>
      {hintAnimatedPoints.length > 0 && (
        <HintImage
          src="https://img.icons8.com/?size=100&id=WgWsyDXOyVHd&format=png&color=000000"
          style={{
            left: hintAnimatedPoints.slice(-1)[0].x - 60,
            top: hintAnimatedPoints.slice(-1)[0].y,
          }}
        />
      )}
    </Container>
  );
};

export default LetterTracingView;
