import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

// -----------thunk---------
import { getQuotesThunk } from "../../store/quotes";

function Quotes() {
  const dispatch = useDispatch();

  const quoteList = useSelector(state => Object.values(state.quotes));
  const sessionUser = useSelector(state => state.session.user);
  const { id } = sessionUser;

  useEffect(() => {
    dispatch(getQuotesThunk());
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
                    <NavLink to={`/quotes/${quote.id}`}>Play</NavLink>
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
