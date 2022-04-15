import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

// -----------thunk---------
import { getQuotesThunk } from "../../store/quotes";
import { getRecordsThunk } from "../../store/records";

function Quotes() {
  const dispatch = useDispatch();

  const quoteList = useSelector(state => Object.values(state.quotes));
  const sessionUser = useSelector(state => state.session.user);
  const { id } = sessionUser;
  const recordList = useSelector(state => Object.values(state.records)).filter(
    record => record.user_id === id
  );

  const hasPlayed = (id, records = recordList) => {
    let bool = false;
    records.forEach(record => {
      if (record.quote_id === id) bool = true;
    });
    return bool;
  };

  useEffect(() => {
    dispatch(getQuotesThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getRecordsThunk());
  }, [dispatch]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Author</th>
            <th>Characters</th>
            <th></th>
          </tr>
        </thead>
        {quoteList.length > 0 &&
          quoteList.map(quote => (
            <tbody key={quote.id}>
              <tr style={{ textAlign: "center" }}>
                <td>{quote.author}</td>
                <td>{quote.char_count}</td>
                <td>
                  <button>
                    <NavLink to={`/quotes/${quote.id}`}>
                      {hasPlayed(quote.id) ? "Play again" : "Play"}
                    </NavLink>
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
      </table>
    </div>
  );
}

export default Quotes;
