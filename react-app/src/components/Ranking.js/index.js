import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getSingleQuoteThunk } from "../../store/quotes";
import { getQuoteRecordsThunk } from "../../store/records";
import { getUsersThunk } from "../../store/users";

import "./Ranking.css";

function Ranking() {
  const dispatch = useDispatch();
  const { quote_id } = useParams();
  const quoteRecordsObj = useSelector(state => state.records);
  const allUsersObj = useSelector(state => state.users);
  const sortedRecords = Object.values(quoteRecordsObj).sort(
    (a, b) => b.score - a.score
  );
  const quote = useSelector(state => state?.quotes?.currQuote);

  useEffect(() => {
    dispatch(getUsersThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getSingleQuoteThunk(quote_id));
  }, [dispatch, quote_id]);

  useEffect(() => {
    dispatch(getQuoteRecordsThunk(quote_id));
  }, [dispatch, quote_id]);

  return (
    <div className="quotes_container container_col">
      <h1 className="head_line">Ranking</h1>
      <div className="quote_card quote_wrapper">
        <h2>Author: {quote?.author}</h2>
        <blockquote>"{quote?.content}"</blockquote>
        <small>{quote?.char_count} characters</small>
      </div>
      <div className="ranking_scores record_container">
        {sortedRecords.length ? (
          sortedRecords.map((record, i) => (
            <div className="record_card" key={record.id}>
              <h3 className="rank_num">{i + 1}</h3>
              <div className="container_col user_score_info">
                <h3>{allUsersObj[record.user_id].username}</h3>
                <ul className="record_list container_row">
                  <li className="wpm">{record.wpm}WPM</li>
                  <li className="acc">Accuracy: {record.accuracy}%</li>
                  <li className="dur">Duration: {record.duration}s</li>
                  <li>
                    <small>@{record.updated_at}</small>
                  </li>
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
