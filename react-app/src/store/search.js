const GET_SEARCH_QUOTES = "search/all_quotes";

const getSearchQuotes = searchQuotes => {
  return {
    type: GET_SEARCH_QUOTES,
    searchQuotes,
  };
};

export const getSearchQuotesThunk = () => async dispatch => {
  const res = await fetch(`/api/quotes/`);
  const data = await res.json();
  dispatch(getSearchQuotes(data));
  return data;
};

const initialState = {};

export default function quotesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SEARCH_QUOTES:
      const newState = {};
      action.searchQuotes.quotes.forEach(quote => (newState[quote.id] = quote));
      return newState;
    default:
      return state;
  }
}
