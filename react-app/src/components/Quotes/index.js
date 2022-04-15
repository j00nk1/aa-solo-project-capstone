import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

// -----------thunk---------
import { getQuotesThunk } from "../../store/quotes";
import { getRecordsThunk } from "../../store/records";

function Quotes() {
  const dispatch = useDispatch();

  const quoteList = useSelector(state => Object.values(state.quotes));
  const sessionUser = useSelector(state => state.session.user);
  const { id } = sessionUser;
  const recordObj = useSelector(state => state.records);
  useEffect(() => {
    if (!Object.keys(recordObj).length) dispatch(getRecordsThunk());
  }, [dispatch, recordObj]);
  const recordList = Object.values(recordObj).filter(
    record => record.user_id === id
  );

  const hasPlayed = (id, records = recordList) => {
    let bool = false;
    records.forEach(record => {
      if (record.quote_id === id) bool = true;
    });
    return bool;
  };

  useEffect(() => {
    dispatch(getQuotesThunk());
  }, [dispatch]);

  return (
    <div className="quotes_container container_col">
      <h1 style={{ textAlign: "center" }}>All Quotes</h1>
      {quoteList.length > 0 &&
        quoteList.map(quote => (
          <div key={quote.id} className="quote_card container_row">
            <div>
              <h2>{quote.author}</h2>
              <p>{quote.char_count} characters</p>
            </div>
            <ul className="record_list container_row">
              {hasPlayed(quote.id) && (
                <>
                  <li>{recordObj[quote.id].wpm + " WPM"}</li>
                  <li>Accuracy: {recordObj[quote.id].accuracy}%</li>
                  <li>
                    Duration:
                    {(recordObj[quote.id].duration / 1000).toFixed(2) + "s"}
                  </li>
                </>
              )}
            </ul>
            <button>
              <NavLink to={`/quotes/${quote.id}`}>
                {hasPlayed(quote.id) ? "Play again" : "Play"}
              </NavLink>
            </button>
          </div>
        ))}
    </div>
  );
}

export default Quotes;
