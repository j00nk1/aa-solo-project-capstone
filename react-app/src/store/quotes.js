const GET_QUOTES = "quotes/all";
const GET_SINGLE_QUOTE = "quote/one";

// ----------------- ACTIONS -----------
const getQuotes = quotes => {
  return {
    type: GET_QUOTES,
    quotes,
  };
};

const getSingleQuote = quote => {
  return {
    type: GET_SINGLE_QUOTE,
    quote,
  };
};

// -------------------THUNK ----------------

export const getQuotesThunk = () => async dispatch => {
  const res = await fetch(`/api/quotes/`);
  const data = await res.json();
  dispatch(getQuotes(data));
  return data;
};

export const getSingleQuoteThunk = quote_id => async dispatch => {
  const res = await fetch(`/api/quotes/${quote_id}/`);
  const data = await res.json();
  dispatch(getSingleQuote(data));
  return data;
};

// ---------------REDUCER------------------
const initialState = {};

export default function quotesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_QUOTES:
      const newState = {};
      action.quotes.quotes.forEach(quote => (newState[quote.id] = quote));
      return newState;
    case GET_SINGLE_QUOTE:
      return { currQuote: action.quote };
    default:
      return state;
  }
}
