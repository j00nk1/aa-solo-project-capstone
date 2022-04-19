import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getRecordsThunk } from "../store/records";

function UsersList() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const allRecordObj = useSelector(state => state.records);
  const sortedRecords = Object.values(allRecordObj).sort(
    (a, b) => b.score - a.score
  );
  console.log(sortedRecords);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/users/");
      const responseData = await response.json();
      setUsers(responseData.users);
    }
    fetchData();
  }, []);

  useEffect(() => {
    dispatch(getRecordsThunk());
  }, [dispatch]);

  const userComponents = users.map(user => {
    return (
      <li key={user.id}>
        <NavLink to={`/users/${user.id}`}>{user.username}</NavLink>
      </li>
    );
  });

  return (
    <>
      <h1>User List: </h1>
      <ul>{userComponents}</ul>
    </>
  );
}

export default UsersList;
