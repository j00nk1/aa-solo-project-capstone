import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { getCommentsThunk } from "../store/comments";
import { getQuotesThunk } from "../store/quotes";
import { deleteRecordThunk, getUserRecordsThunk } from "../store/records";
import { getUsersThunk } from "../store/users";
import Comments from "./Comments";
import "./User.css";

import { deleteBtn } from "../functions";

function User() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [user, setUser] = useState({});
  const { userId } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const recordList = useSelector(state => Object.values(state.records));
  const quoteObj = useSelector(state => state.quotes);

  let avg_wpm = 0;
  let avg_acc = 0;
  let avg_dur = 0;

  recordList.forEach(record => {
    avg_wpm += record.wpm;
    avg_acc += record.accuracy;
    avg_dur += record.duration;
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
            <ul>
              <li>WPM: {Math.round(avg_wpm * 100) / 100}</li>
              <li>Accuracy: {Math.round(avg_acc * 100) / 100}%</li>
              <li>Duration {Math.round(avg_dur) / 1000}s</li>
            </ul>
          </div>
          <div className="last_played">
            <h3>Last Played</h3>
            <ul>
              <li>quote.author</li>
              <li>quote.content</li>
              <li>quote.char_count</li>
            </ul>
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
                      <p className="wpm">{record.wpm}WPM</p>
                      <p className="acc">Accuracy: {record.accuracy}%</p>
                      <p className="dur">Duration: {record.dur_time}s</p>
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
              <p>No Record Yet</p>
              {/* <NavLink >Play the game and create a new record!</NavLink> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default User;
