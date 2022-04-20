import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";

import { getSingleQuoteThunk } from "../../store/quotes";
import { getQuoteRecordsThunk } from "../../store/records";
import { getUsersThunk } from "../../store/users";

import "./Ranking.css";

function Ranking() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { quote_id } = useParams();
  const quoteRecordsObj = useSelector(state => state.records);
  const allUsersObj = useSelector(state => state.users);
  const sessionUser = useSelector(state => state.session.user);
  let hasPlayed = false;
  let record_id;
  const sortedRecords = Object.values(quoteRecordsObj).sort((a, b) => {
    if (a.user_id === sessionUser.id || b.user_id === sessionUser.id) {
      record_id = a.id;
      hasPlayed = true;
    }
    if (b.score === a.score) {
      return a.duration - b.duration;
    }
    return b.score - a.score;
  });

  // if there is only one record, it doesn't run the sort function,
  // so manually check the record and see the session user has played this quote
  if (
    sortedRecords.length === 1 &&
    sortedRecords[0].user_id === sessionUser.id
  ) {
    hasPlayed = true;
    record_id = sortedRecords[0].id;
  }

  const quote = useSelector(state => state?.quotes?.currQuote);
  // console.log("QUOTE", quote);

  useEffect(() => {
    dispatch(getSingleQuoteThunk(quote_id));
  }, [dispatch, quote_id]);

  useEffect(() => {
    dispatch(getUsersThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getQuoteRecordsThunk(quote_id));
  }, [dispatch, quote_id]);

  return (
    <div className="quotes_container container_col">
      <h1 className="head_line">Ranking</h1>
      <div className="quote_card quote_wrapper">
        <h2 style={{ display: "inline-block", marginRight: "10px" }}>
          Author: {quote?.author}
        </h2>
        <div>
          <blockquote>"{quote?.content}"</blockquote>
          <small>{quote?.char_count} characters</small>
        </div>
        {hasPlayed ? (
          <NavLink
            to={{
              pathname: `/quotes/${quote_id}`,
              state: {
                wpm: quoteRecordsObj[record_id]?.wpm,
                accuracy: quoteRecordsObj[record_id]?.accuracy,
                duration: quoteRecordsObj[record_id]?.duration / 1000,
              },
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
            to={`/quotes/${quote_id}`}
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
      </div>
      <div className="ranking_scores record_container">
        {sortedRecords.length ? (
          sortedRecords.map((record, i) => (
            <div
              className="record_card user_link"
              title="To this user's profile"
              key={record.id}
              onClick={() =>
                history.push(`/users/${allUsersObj[record.user_id].id}`)
              }
            >
              <h3 className="rank_num">{i + 1}</h3>
              <div className="container_col user_score_info">
                <h3>{allUsersObj[record.user_id]?.username}</h3>
                <ul className="record_list container_row">
                  <li className="wpm">{record.wpm}WPM</li>
                  <li className="acc">Accuracy: {record.accuracy}%</li>
                  <li className="dur">Duration: {record.duration / 1000}s</li>
                  <li>Score: {Math.round(record.score * 100) / 100}</li>
                  {/* TODO: Render converted time  */}
                  {/* <li>
                    <small>@{record.updated_at}</small>
                  </li> */}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <h3 style={{ textAlign: "center" }}>There's no record yet</h3>
        )}
      </div>
    </div>
  );
}

export default Ranking;
