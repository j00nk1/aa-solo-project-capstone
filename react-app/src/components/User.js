import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getQuotesThunk } from "../store/quotes";
import { getRecordsThunk } from "../store/records";

function User() {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const { userId } = useParams();
  const recordList = useSelector(state => Object.values(state.records));
  const quoteObj = useSelector(state => state.quotes);

  useEffect(() => {
    if (!recordList.length) dispatch(getRecordsThunk());
  }, [dispatch, recordList]);

  useEffect(() => {
    if (!Object.keys(quoteObj).length) dispatch(getQuotesThunk());
  }, [dispatch, quoteObj]);

  const userRecords = recordList.filter(record => record.user_id === +userId);

  useEffect(() => {
    if (!userId) {
      return;
    }
    (async () => {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      setUser(user);
    })();
  }, [userId]);

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
        {userRecords.length > 0 &&
          userRecords.map(record => (
            <div key={record.id} className="quote_card">
              <h3>{quoteObj[record.quote_id].author}</h3>
            </div>
          ))}
      </div>
    </div>
  );
}
export default User;
