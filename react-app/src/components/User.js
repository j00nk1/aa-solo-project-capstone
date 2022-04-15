import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getRecordsThunk } from "../store/records";

function User() {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const { userId } = useParams();
  const recordList = useSelector(state => Object.values(state.records));

  useEffect(() => {
    if (!recordList.length) dispatch(getRecordsThunk());
  }, [dispatch, recordList]);

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
  );
}
export default User;
