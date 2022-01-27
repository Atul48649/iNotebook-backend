const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/inotebook_development');
  console.log('Connected to Database :: MongoDB');
}