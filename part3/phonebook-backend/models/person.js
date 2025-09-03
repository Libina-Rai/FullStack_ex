require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters long"],
  },
  number: {
    type: String,
    required: [true, "Number is required"],
    validate: {
      validator: function (v) {
        if (v.length < 8) return false;

        const parts = v.split("-");
        if (parts.length !== 2) return false;

        const [first, second] = parts;
        if (!/^\d{2,3}$/.test(first)) return false;
        if (!/^\d+$/.test(second)) return false;

        return true;
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Use format xx-xxxxxxx or xxx-xxxxxxx.`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
