const GET_QUOTES = "quotes/all";

// ----------------- ACTIONS -----------
const getQuotes = quotes => {
  return {
    type: GET_QUOTES,
    quotes,
  };
};

// -------------------THUNK ----------------

export const getQuotesThunk = () => async dispatch => {
  const res = await fetch(`/api/quotes`);
  const data = await res.json();
  dispatch(getQuotes(data));
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
    default:
      return state;
  }
}
