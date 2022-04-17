import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import TypingInput from "./TypingInput";
import { getQuotesThunk } from "../../store/quotes";
import "./Game.css";

function Game() {
  const location = useLocation();
  const score = location.state;
  const dispatch = useDispatch();
  const quoteId = useParams().id;
  const quotesObj = useSelector(state => state.quotes);

  useEffect(() => {
    dispatch(getQuotesThunk());
  }, [dispatch]);

  const currQuote = quotesObj[quoteId];

  return (
    <div className="container">
      <div>
        <h1>{currQuote?.author}</h1>
      </div>
      <p>Esc to reset</p>
      <p style={{ color: "grey", marginBottom: 10 }}>
        Click on the text below and start typing
      </p>
      {/* TODO: might change the place to render the prev score */}
      {score ? (
        <div>
          <h2>Previous Score</h2>
          <p className="wpm score_in_game">WPM: {score.wpm}</p>
          <p className="acc score_in_game">Accuracy: {score.accuracy}%</p>
          <p className="dur score_in_game">Duration: {score.duration}s</p>
        </div>
      ) : null}
      <div>
        <TypingInput text={currQuote} />
      </div>
    </div>
  );
}

export default Game;
