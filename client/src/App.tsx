import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SocketProvider } from "./contexts/SocketContext";
import HomePage from "./screens/HomePage";
import CreateGameScreen from "./screens/CreateGameScreen";
import JoinGameScreen from "./screens/JoinGameScreen";
import LobbyScreen from "./screens/LobbyScreen";
import GameScreen from "./screens/GameScreen";
import SinglePlayerScreen from "./screens/SinglePlayerScreen";
import SinglePlayerGameScreen from "./screens/SinglePlayerGameScreen";

function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateGameScreen />} />
            <Route path="/join" element={<JoinGameScreen />} />
            <Route path="/lobby/:roomCode" element={<LobbyScreen />} />
            <Route path="/game/:roomCode" element={<GameScreen />} />
            <Route path="/single-player" element={<SinglePlayerScreen />} />
            <Route
              path="/single-player/game"
              element={<SinglePlayerGameScreen />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
