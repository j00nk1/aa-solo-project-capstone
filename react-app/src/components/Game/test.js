import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import TypingInput from "./TypingInput";
import { getQuotesThunk } from "../../store/quotes";

function Test() {
  const dispatch = useDispatch();
  const quoteId = useParams().id;
  const quotesObj = useSelector(state => state.quotes);

  useEffect(() => {
    dispatch(getQuotesThunk());
  }, [dispatch]);

  const currQuote = quotesObj[quoteId];

  return (
    <div>
      <div>
        <h1>{currQuote?.author}</h1>
      </div>
      <p>Esc to reset</p>
      <div>
        <TypingInput text={currQuote} />
      </div>
    </div>
  );
}

export default Test;
