import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/header/Header";
import { useTour } from "@reactour/tour";
import Game from "./components/Game";
import GesturePathPainter from "./components/GesturePathPainter";
import { LetterTracing } from "./components/LetterTracing";
// import Test from "./components/Test";
function App() {
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
      {/* <Test /> */}
    </>
  );
}

export default App;
