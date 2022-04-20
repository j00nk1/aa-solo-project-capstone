import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { getCommentsThunk } from "../store/comments";
import { getQuotesThunk } from "../store/quotes";
import { deleteRecordThunk, getUserRecordsThunk } from "../store/records";
import { getUsersThunk } from "../store/users";
import Comments from "./Comments";
import "./User.css";

import { deleteBtn, localDate, localTime } from "../functions";

function User() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [user, setUser] = useState({});
  const { userId } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const recordList = useSelector(state => Object.values(state.records));
  const quoteObj = useSelector(state => state.quotes);
  const highestScore = recordList.sort((a, b) => b.score - a.score)[0];

  let avg_wpm = 0;
  let avg_acc = 0;
  let avg_dur = 0;

  recordList.forEach(record => {
    avg_wpm += record.wpm;
    avg_acc += record.accuracy;
    avg_dur += record.dur_time;
  });

  if (avg_wpm) avg_wpm = avg_wpm / recordList.length;
  if (avg_acc) avg_acc = avg_acc / recordList.length;
  if (avg_dur) avg_dur = avg_dur / recordList.length;

  useEffect(() => {
    if (!userId) {
      return;
    }
    (async () => {
      const response = await fetch(`/api/users/${userId}/`);
      const user = await response.json();
      setUser(user);
    })();
  }, [userId]);

  useEffect(() => {
    dispatch(getUsersThunk());
  }, [dispatch]);

  useEffect(() => {
    const render = async () => await dispatch(getQuotesThunk());
    render();
  }, [dispatch]);

  useEffect(() => {
    const render = async () => await dispatch(getUserRecordsThunk(userId));
    render();
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(getCommentsThunk());
  }, [dispatch]);

  // force scroll to the top of the page after render the profile page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [userId]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="profile_header_container container_col">
        <h2>{user.username}'s status</h2>
        <div className="status_wrapper container_row">
          <div className="avg_score">
            <h3>Average Score</h3>
            {avg_wpm ? (
              <ul>
                <li>WPM: {Math.round(avg_wpm * 100) / 100}</li>
                <li>Accuracy: {Math.round(avg_acc * 100) / 100}%</li>
                <li>Duration: {Math.round(avg_dur * 1000) / 1000}s</li>
              </ul>
            ) : (
              <p>There's no records to display</p>
            )}
          </div>
          <div className="last_played">
            <h3>Hightest Record</h3>
            {highestScore && quoteObj ? (
              <ul>
                <li>
                  Author: {quoteObj[highestScore?.quote_id]?.author}{" "}
                  <small>
                    {quoteObj[highestScore?.quote_id]?.char_count} Characters
                  </small>
                </li>
                <li>WPM: {highestScore.wpm}</li>
                <li>Accuracy: {highestScore.accuracy}</li>
                <li>Duration: {highestScore.dur_time}</li>
              </ul>
            ) : (
              <p>There's no records to display</p>
            )}
          </div>
        </div>
      </div>

      <div className="quotes_container qc_in_profile">
        <h2 className="head_line">{user.username}'s Records</h2>
        <div className="quote_wrapper">
          {recordList.length > 0 &&
            recordList.map(record => (
              <div key={record.id} className="record_container">
                <div
                  key={record.id + "quote_card"}
                  className="quote_card container_row"
                >
                  <div
                    className="ranking_link_area"
                    title="To ranking page"
                    onClick={() =>
                      history.push(`/ranking/${quoteObj[record.quote_id]?.id}/`)
                    }
                  >
                    <h2>{quoteObj[record.quote_id]?.author}</h2>
                    <blockquote>
                      &ldquo;{quoteObj[record.quote_id]?.content}&rdquo;
                    </blockquote>
                    <small>
                      {quoteObj[record.quote_id]?.char_count} Characters
                    </small>
                    <ul className="record_list container_row">
                      <li className="wpm">{record.wpm}WPM</li>
                      <li className="acc">Accuracy: {record.accuracy}%</li>
                      <li className="dur">Duration: {record.dur_time}s</li>
                      <li>
                        <small>@{localTime(record.updated_at)}</small>
                        <small className="updated_date">
                          {localDate(record.updated_at)}
                        </small>
                      </li>
                    </ul>
                  </div>
                  {sessionUser.id === +userId && (
                    <div className="container_col btn_container">
                      <NavLink
                        to={{
                          pathname: `/quotes/${quoteObj[record.quote_id]?.id}`,
                          state: {
                            wpm: record.wpm,
                            accuracy: record.accuracy,
                            duration: record.dur_time,
                          },
                        }}
                        style={{ width: "100%" }}
                      >
                        <button
                          className="play_btn"
                          // onClick={() => history.push(`/quotes/${quote.id}`)}
                        >
                          Play again
                        </button>
                      </NavLink>
                      <button
                        className="delete_btn"
                        value={record.id}
                        onClick={e =>
                          deleteBtn(
                            e.target.value,
                            "Are you sure you want to delete this record?",
                            dispatch,
                            deleteRecordThunk
                          )
                        }
                      >
                        Delete Score
                      </button>
                    </div>
                  )}
                </div>
                <div
                  key={record.id + "comment_area"}
                  className="container_col comment_area in_profile"
                >
                  <Comments
                    key={record.id + "comment_area"}
                    record_id={record.id}
                  />
                </div>
              </div>
            ))}
          {!recordList.length && (
            <div className="record_container">
              <p>There's no records to display</p>
              {/* <NavLink >Play the game and create a new record!</NavLink> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default User;
