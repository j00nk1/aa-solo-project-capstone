import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleQuoteThunk } from "../../store/quotes";
import { getQuoteRecordsThunk } from "../../store/records";
import { getUsersThunk } from "../../store/users";

function Ranking() {
  const dispatch = useDispatch();
  const { quote_id } = useParams();
  // const [users, setUsers] = useState([]);
  // const quoteRecordsObj = useSelector(state => state.records);
  // const sortedRecords = Object.values(quoteRecordsObj).sort(
  //   (a, b) => b.score - a.score
  // );
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
    </div>
  );
}

export default Ranking;
