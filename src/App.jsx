import "./App.css";

import { useEffect, useState } from "react";

import { db } from "./firebase";

import {
  ref,
  set,
  onValue,
  runTransaction,
  update
} from "firebase/database";

import { questions } from "./questions";

function App() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);

  const [players, setPlayers] = useState({});

  const [buzzWinner, setBuzzWinner] = useState(null);

  const [answer, setAnswer] = useState("");

  const [currentQuestion] = useState(questions[0]);

  let playerId = localStorage.getItem("playerId");

  if (!playerId) {
    playerId =
      Math.random().toString(36).substring(2);

    localStorage.setItem(
      "playerId",
      playerId
    );
  }

  const createRoom = () => {
    const id = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    set(ref(db, `rooms/${id}`), {
      buzz: null
    });

    joinRoom(id);
  };

  const joinRoom = (id) => {
    if (!name) return;

    set(
      ref(
        db,
        `rooms/${id}/players/${playerId}`
      ),
      {
        name,
        score: 0
      }
    );

    onValue(
      ref(db, `rooms/${id}/players`),
      (snapshot) => {
        setPlayers(snapshot.val() || {});
      }
    );

    onValue(
      ref(db, `rooms/${id}/buzz`),
      (snapshot) => {
        setBuzzWinner(snapshot.val());
      }
    );

    setRoomId(id);
    setJoined(true);
  };

  const handleBuzz = async () => {
    const buzzRef = ref(
      db,
      `rooms/${roomId}/buzz`
    );

    const result = await runTransaction(
      buzzRef,
      (current) => {
        if (current === null) {
          return playerId;
        }
        return current;
      }
    );

    if (result.committed) {
      alert("回答権獲得！");
    }
  };

  const submitAnswer = () => {
    if (
      answer === currentQuestion.answer
    ) {
      const currentScore =
        players[playerId]?.score || 0;

      update(
        ref(
          db,
          `rooms/${roomId}/players/${playerId}`
        ),
        {
          score: currentScore + 10
        }
      );

      alert("正解！");
    } else {
      alert("不正解");
    }

    set(ref(db, `rooms/${roomId}/buzz`), null);

    setAnswer("");
  };

  if (!joined) {
    return (
      <div className="container">
        <h1>早押しクイズ</h1>

        <input
          placeholder="名前"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <button onClick={createRoom}>
          部屋作成
        </button>

        <input
          placeholder="ルームID"
          onChange={(e) =>
            setRoomId(e.target.value)
          }
        />

        <button
          onClick={() =>
            joinRoom(roomId)
          }
        >
          参加
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>ルーム: {roomId}</h1>

      <div className="questionBox">
        <h2>
          {currentQuestion.question}
        </h2>
      </div>

      <button
        className="buzzButton"
        onClick={handleBuzz}
      >
        早押し！
      </button>

      {buzzWinner === playerId && (
        <div>
          <input
            placeholder="回答"
            value={answer}
            onChange={(e) =>
              setAnswer(e.target.value)
            }
          />

          <button onClick={submitAnswer}>
            回答
          </button>
        </div>
      )}

      <h2>プレイヤー</h2>

      {Object.entries(players).map(
        ([id, player]) => (
          <div
            key={id}
            className="playerCard"
          >
            {player.name} :
            {player.score}点
          </div>
        )
      )}
    </div>
  );
}

export default App;