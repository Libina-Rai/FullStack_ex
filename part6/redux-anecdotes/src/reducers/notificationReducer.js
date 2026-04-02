import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    setNotification(state, action) {
      return action.payload; // set text
    },
    clearNotification() {
      return ""; // clear text
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;

// Thunk to set notification and auto-clear
export const showNotification = (message, seconds) => {
  return (dispatch) => {
    dispatch(setNotification(message));
    setTimeout(() => {
      dispatch(clearNotification());
    }, seconds * 1000);
  };
};

export default notificationSlice.reducer;
