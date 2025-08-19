const mongoose = require('mongoose');

const args = process.argv.slice(2);

if (args.length < 1) {
  console.log('Please provide the password as the first argument');
  process.exit(1);
}

const password = args[0];
const name = args[1];   // optional
const number = args[2]; // optional

const url = `mongodb+srv://libinarai:${password}@part3-ex.algckto.mongodb.net/phonebook`;

mongoose.connect(url)
  .then(() => {
    const personSchema = new mongoose.Schema({ name: String, number: String });
    const Person = mongoose.model('Person', personSchema);

    if (!name && !number) {
      // Only password provided → list all entries
      Person.find({}).then(result => {
        console.log('Phonebook:');
        result.forEach(p => console.log(`${p.name} ${p.number}`));
        mongoose.connection.close();
      });
    } else if (name && number) {
      // Add new entry
      const person = new Person({ name, number });
      person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
      });
    } else {
      console.log('Usage: node mongo.js <password> <name> <number>');
      mongoose.connection.close();
    }
  })
  .catch(err => console.error('Error connecting to MongoDB:', err.message));
