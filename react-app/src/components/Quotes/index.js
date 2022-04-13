import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// -----------thunk---------
import { getQuotesThunk } from "../../store/quotes";

function Quotes() {
  const dispatch = useDispatch();

  const quoteList = useSelector(state =>state.quotes);
  
  useEffect(() => {
    dispatch(getQuotesThunk())
  }, [dispatch]);


  return (
    <div>
      <ul>
        {quoteList?.quotes?.quotes.length > 0 && quoteList.quotes.quotes.map(quote => <li key={quote.id}>{quote.author}</li>)
}
      </ul>
    </div>)

}

export default Quotes;
