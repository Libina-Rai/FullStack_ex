import { useSelector } from "react-redux";

const Notification = () => {
  const message = useSelector((state) => state.notification); // get notification text from Redux

  if (!message) return null; // don't render anything if there's no notification

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
  };

  return <div style={style}>{message}</div>;
};

export default Notification;
