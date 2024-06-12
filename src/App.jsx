import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/header/Header";
import { useTour } from "@reactour/tour";
import Game from "./components/Game";
import GesturePathPainter from "./components/GesturePathPainter";
import { LetterTracing } from "./components/LetterTracing";
import LetterTracingView from "./components/LetterTracingView";
function App() {
  const { setIsOpen } = useTour();
  class MyOffsetModel {
    constructor(offsetList, isTraced = false) {
      this.offsetList = offsetList;
      this.isTraced = isTraced;
    }
  }

  const imagePath = "A.png";
  const viewSize = { width: 800, height: 600 };
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
  return (
    <>
      {/* <button onClick={() => setIsOpen(true)}>Open Tour</button> */}
      {/* <Header className="first-step" /> */}
      {/* <Game /> */}
      {/* <LetterTracing /> */}
      <GesturePathPainter />
      {/* <LetterTracingView
        strokes={strokes}
        imagePath={imagePath}
        viewSize={viewSize}
      /> */}
    </>
  );
}

export default App;
