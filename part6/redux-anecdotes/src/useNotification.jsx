import { useContext } from "react";
import NotificationContext from "./NotificationContext";

let clearNotificationTimer = null; // Timer ID for clearing notifications
export const useNotification = () => {
  const [notification, dispatch] = useContext(NotificationContext);

  const showNotification = (message, seconds) => {
    dispatch({ type: "SET", payload: message });

    if (clearNotificationTimer) {
      clearTimeout(clearNotificationTimer); // Clear existing timer if it exists
    }

    clearNotificationTimer = setTimeout(() => {
      dispatch({ type: "CLEAR" });
      clearNotificationTimer = null; // Reset timer ID after clearing notification
    }, seconds * 1000);
  };

  return [notification, showNotification];
};
