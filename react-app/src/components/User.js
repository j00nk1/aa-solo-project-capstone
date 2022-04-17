import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { getQuotesThunk } from "../store/quotes";
import { deleteRecordThunk, getUserRecordsThunk } from "../store/records";
import Comments from "./Comments";

function User() {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const { userId } = useParams();
  const recordList = useSelector(state => Object.values(state.records));
  const quoteObj = useSelector(state => state.quotes);

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
    if (!Object.keys(quoteObj).length) dispatch(getQuotesThunk());
  }, [dispatch, quoteObj]);

  useEffect(() => {
    const render = async () => await dispatch(getUserRecordsThunk(userId));
    render();
  }, [dispatch, userId]);

  const deleteBtn = async rec_id => {
    await dispatch(deleteRecordThunk(rec_id));
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <ul>
        <li>
          <strong>User Id</strong> {userId}
        </li>
        <li>
          <strong>Username</strong> {user.username}
        </li>
        <li>
          <strong>Email</strong> {user.email}
        </li>
      </ul>

      <div className="quotes_container">
        {recordList.length > 0 &&
          recordList.map(record => (
            <div key={record.id} style={{ marginBottom: "1.5rem" }}>
              <div
                key={record.id + "quote_card"}
                className="quote_card container_row"
              >
                <div>
                  <h2>{quoteObj[record.quote_id].author}</h2>
                  <p>{quoteObj[record.quote_id].char_count} Characters</p>
                  <ul className="record_list container_row">
                    <p className="wpm">{record.wpm}WPM</p>
                    <p className="acc">Accuracy: {record.accuracy}%</p>
                    <p className="dur">Duration: {record.dur_time}s</p>
                  </ul>
                </div>
                <div className="container_col btn_container">
                  <button
                    className="play_btn"
                    // onClick={() => history.push(`/quotes/${quote.id}`)}
                  >
                    <NavLink
                      to={{
                        pathname: `/quotes/${quoteObj[record.quote_id].id}`,
                        state: {
                          wpm: record.wpm,
                          accuracy: record.accuracy,
                          duration: record.dur_time,
                        },
                      }}
                      style={{ width: "100%" }}
                    >
                      Play again
                    </NavLink>
                  </button>
                  <button
                    className="delete_btn"
                    value={record.id}
                    onClick={e => deleteBtn(e.target.value)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div
                key={record.id + "comment_area"}
                className="container_col"
                style={{ margin: "1rem auto" }}
              >
                <Comments record_id={record.id} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
export default User;
