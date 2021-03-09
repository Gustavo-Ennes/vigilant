const mongoose = require('mongoose');
const pass = encodeURIComponent(process.env.DBPASS)
const url = `mongodb+srv://kratosdev:${pass}@cluster0.1aaih.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true ,
    useFindAndModify: false
}

mongoose.connect(url,connectionParams).catch( (err) => {
		console.error(`Error connecting to the database. \n${err}`);
});

mongoose.Promise = global.Promise;

module.exports = mongoose