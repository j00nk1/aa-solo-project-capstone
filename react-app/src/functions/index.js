export const localTime = time => {
  const l_time = new Date(time).toLocaleTimeString([]);
  return l_time;
};

export const localDate = time => {
  const l_date = new Date(time).toLocaleDateString([]);
  return l_date;
};

export const deleteBtn = async (id, message, dispatch, thunk) => {
  if (window.confirm(message)) await dispatch(thunk(id));
};
