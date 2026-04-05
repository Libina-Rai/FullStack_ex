import { useContext } from "react";
import NotificationContext from "./NotificationContext";

export const useNotification = () => {
  const [notification, dispatch] = useContext(NotificationContext);

  const showNotification = (message, seconds) => {
    dispatch({ type: "SET", payload: message });

    setTimeout(() => {
      dispatch({ type: "CLEAR" });
    }, seconds * 1000);
  };

  return [notification, showNotification];
};