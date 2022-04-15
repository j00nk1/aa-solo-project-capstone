import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

// -----------thunk---------
import { getQuotesThunk } from "../../store/quotes";
import { deleteRecordThunk, getUserRecordsThunk } from "../../store/records";

function Quotes() {
  const dispatch = useDispatch();
  const history = useHistory();

  const quoteList = useSelector(state => Object.values(state.quotes));
  const sessionUser = useSelector(state => state.session.user);
  const [hasPlayed, setHasPlayed] = useState(false);
  const user_id = sessionUser.id;
  const recordObj = useSelector(state => state.records);
  useEffect(() => {
    dispatch(getUserRecordsThunk(user_id));
  }, [dispatch, user_id]);
  const recordList = Object.values(recordObj);

  useEffect(() => {
    dispatch(getQuotesThunk());
  }, [dispatch]);

  const hasPlayedFunc = (quote_id, records = recordList) => {
    let bool = false;
    records.forEach(record => {
      if (record.quote_id === quote_id) {
        bool = true;
      }
    });
    return bool;
  };

  const deleteBtn = async quote_id => {
    const recordId = recordObj[quote_id]?.id;
    await dispatch(deleteRecordThunk(recordId));
    hasPlayed(quote_id);
  };

  return (
    <div className="quotes_container container_col">
      <h1 style={{ textAlign: "center" }}>All Quotes</h1>
      {quoteList.length > 0 &&
        quoteList.map(quote => (
          <div key={quote.id} className="quote_card container_row">
            <div>
              <h2>{quote.author}</h2>
              <p>{quote.char_count} characters</p>
              <ul className="record_list container_row">
                {setHasPlayed(() => hasPlayedFunc(quote.id)) && (
                  <>
                    <li className="wpm">{recordObj[quote.id]?.wpm + " WPM"}</li>
                    <li className="acc">
                      Accuracy: {recordObj[quote.id]?.accuracy}%
                    </li>
                    <li className="dur">
                      Duration:
                      {(recordObj[quote.id]?.duration / 1000).toFixed(2) + "s"}
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="container_col btn_container">
              <button
                className="play_btn"
                onClick={() => history.push(`/quotes/${quote.id}`)}
              >
                {hasPlayed(quote.id) ? "Play again" : "Play"}
              </button>
              {hasPlayed(quote.id) && (
                <button
                  className="delete_btn"
                  onClick={() => deleteBtn(quote.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

export default Quotes;
