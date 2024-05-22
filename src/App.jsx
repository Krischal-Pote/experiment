import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/header/Header";
import { useTour } from "@reactour/tour";
import Game from "./components/Game";
function App() {
  const { setIsOpen } = useTour();
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Tour</button>
      <Header className="first-step" />
      <Game />
    </>
  );
}

export default App;
