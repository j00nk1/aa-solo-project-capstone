import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import useTypingGame from "react-typing-game-hook";

import { getQuotesThunk } from "../../store/quotes";

function Game() {
  const dispatch = useDispatch();
  const quoteId = useParams().id;
  const quotesObj = useSelector(state => state.quotes);
  const currQuote = quotesObj[quoteId];
  const [text, setText] = useState("");

  const {
    states: {
      chars,
      charsState,
      phase,
      correctChar,
      errorChar,
      startTime,
      endTime,
    },
    actions: { insertTyping, resetTyping, deleteTyping },
  } = useTypingGame(currQuote?.content);

  useEffect(() => {
    dispatch(getQuotesThunk());
  }, [dispatch]);

  return (
    <div>
      {
        <>
          <h1>
            <small>By</small> {currQuote?.author}
          </h1>
        </>
      }
      <h2
        onKeyDown={e => {
          const key = e.key;
          if (key === "Escape") {
            resetTyping();
          } else if (key === "Backspace") {
            deleteTyping(false);
          } else if (key.length === 1) {
            insertTyping(key);
          }
          e.preventDefault();
        }}
        tabIndex={0}
      >
        {chars.split("").map((char, index) => {
          let state = charsState[index];
          let color = state === 0 ? "white" : state === 1 ? "green" : "red";
          return (
            <span key={char + index} style={{ color }}>
              {char}
            </span>
          );
        })}
      </h2>
    </div>
  );
}

export default Game;
