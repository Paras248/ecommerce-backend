const app = require("./app");

const { PORT } = process.env;
const connectWithDb = require("./config/db");

// connect with database
connectWithDb();

app.listen(PORT, () => {
	console.log(`Server started running successfully at PORT ${PORT}`);
});
