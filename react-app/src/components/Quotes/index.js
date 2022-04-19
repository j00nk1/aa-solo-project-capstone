import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

// -----------thunk---------
import { getQuotesThunk } from "../../store/quotes";
import { deleteRecordThunk, getUserRecordsThunk } from "../../store/records";

function Quotes() {
  const dispatch = useDispatch();

  const quoteList = useSelector(state => Object.values(state.quotes));
  const sessionUser = useSelector(state => state.session.user);

  const user_id = sessionUser.id;
  const recordObj = useSelector(state => state.records);
  useEffect(() => {
    dispatch(getUserRecordsThunk(user_id));
  }, [dispatch, user_id]);

  const recordList = Object.values(recordObj);

  useEffect(() => {
    dispatch(getQuotesThunk());
  }, [dispatch]);

  let played;
  const hasPlayed = (id, records = recordList) => {
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      if (record.quote_id === id) {
        setScore(record);
        return true;
      }
    }
    played = false;
    return false;
  };

  // since useState will rerender too many times in the nested loop,
  // use this method to set scores
  let wpm, accuracy, duration, record_id;
  const setScore = rec => {
    wpm = rec.wpm;
    accuracy = rec.accuracy;
    duration = rec.dur_time;
    record_id = rec.id;
    played = true;
  };

  const deleteBtn = async rec_id => {
    if (window.confirm("Are you sure you want to delete this record?"))
      await dispatch(deleteRecordThunk(rec_id));
  };

  return (
    <div className="quotes_container container_col">
      <h1 style={{ textAlign: "center" }}>All Quotes</h1>
      <div className="quote_wrapper">
        {quoteList.length > 0 &&
          quoteList.map(quote => (
            <div key={quote.id} className="quote_wrapper">
              <div className="quote_card container_row">
                <div>
                  <h2>{quote.author}</h2>
                  <blockquote>{quote.content}</blockquote>
                  <small>{quote.char_count} characters</small>
                  <ul className="record_list container_row">
                    {hasPlayed(quote.id) && (
                      <>
                        <li className="wpm">{`${wpm}WPM`}</li>
                        <li className="acc">Accuracy: {accuracy}%</li>
                        <li className="dur">Duration: {duration}s</li>
                        {/* <button
                      value={record_id}
                      onClick={e => console.log(e.target.value)}
                    >
                      DELETE
                    </button> */}
                      </>
                    )}
                  </ul>
                </div>
                <div className="container_col btn_container">
                  {played ? (
                    <NavLink
                      to={{
                        pathname: `/quotes/${quote.id}`,
                        state: { wpm, accuracy, duration },
                      }}
                      style={{ display: "inline-block", width: "100%" }}
                    >
                      <button
                        className="play_btn"
                        // onClick={() => history.push(`/quotes/${quote.id}`)}
                      >
                        Play again
                      </button>
                    </NavLink>
                  ) : (
                    <NavLink
                      to={`/quotes/${quote.id}`}
                      style={{ display: "inline-block", width: "100%" }}
                    >
                      <button
                        className="play_btn"
                        // onClick={() => history.push(`/quotes/${quote.id}`)}
                      >
                        Play
                      </button>
                    </NavLink>
                  )}

                  {played && (
                    <button
                      className="delete_btn"
                      value={record_id}
                      onClick={e => deleteBtn(e.target.value)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Quotes;
