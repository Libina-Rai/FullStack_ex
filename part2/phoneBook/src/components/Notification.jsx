const Notification = ({ successMessage }) => {
  if (!successMessage) return null; // hide if empty
  return (
    <div className="success-message">
      {successMessage}
    </div>
  );
};

export default Notification;
