import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { deleteBtn, localDate, localTime } from "../../functions";

// -----------thunk---------
import { getQuotesThunk } from "../../store/quotes";
import { deleteRecordThunk, getUserRecordsThunk } from "../../store/records";

import "./Quotes.css";

function Quotes() {
  const dispatch = useDispatch();
  const history = useHistory();

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
  let wpm, accuracy, duration, record_id, updated_at;
  const setScore = rec => {
    wpm = rec.wpm;
    accuracy = rec.accuracy;
    duration = rec.dur_time;
    record_id = rec.id;
    updated_at = rec.updated_at;
    played = true;
  };

  return (
    <div className="quotes_container container_col">
      <h1 style={{ textAlign: "center" }}>All Quotes</h1>
      <div className="quote_wrapper">
        {quoteList.length > 0 &&
          quoteList.map(quote => (
            <div key={quote.id} className="quote_wrapper">
              <div className="quote_card container_row">
                <div
                  className="ranking_link_area"
                  title="To ranking page"
                  onClick={() => history.push(`/ranking/${quote.id}/`)}
                >
                  <h2>{quote.author}</h2>
                  <blockquote>{quote.content}</blockquote>
                  <small>{quote.char_count} characters</small>
                  <ul className="record_list container_row">
                    {hasPlayed(quote.id) && (
                      <>
                        <li className="wpm">{`${wpm}WPM`}</li>
                        <li className="acc">Accuracy: {accuracy}%</li>
                        <li className="dur">Duration: {duration}s</li>
                        <li>
                          <small>@{localTime(updated_at)}</small>
                          <small className="updated_date">
                            {localDate(updated_at)}
                          </small>
                        </li>
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
                      onClick={e =>
                        deleteBtn(
                          e.target.value,
                          "Are you sure you want to delete this record?",
                          dispatch,
                          deleteRecordThunk
                        )
                      }
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
