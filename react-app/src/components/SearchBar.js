import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./SearchBar.css";
import { getSearchQuotesThunk } from "../store/search";

const getFilteredSearch = (search, quoteList) => {
  if (!search) {
    return;
  }
  const matchingList = quoteList.filter(quote =>
    quote.author.toUpperCase().includes(search.toUpperCase())
  );
  return matchingList;
};

const SearchBar = () => {
  // const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const quoteObj = useSelector(state => state.searchQuotes);
  const quoteList = Object.values(quoteObj);

  const [search, setSearch] = useState("");

  const filteredSearch = getFilteredSearch(search, quoteList);

  useEffect(() => {
    dispatch(getSearchQuotesThunk());
  }, [dispatch]);

  return (
    <div className="search_bar_container">
      <input
        className="search_bar"
        type="text"
        placeholder="Search Quote by Author name"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="search_results_container">
        {filteredSearch?.map(quote => (
          <NavLink
            style={{ textDecoration: "none", color: "black" }}
            to={`/ranking/${quote.id}`}
            onClick={e => setSearch("")}
          >
            <div className="search_bar_quote" key={quote.id}>
              <p className="quote_result">
                {quote.author}, <small>{quote.char_count}chars</small>
              </p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
