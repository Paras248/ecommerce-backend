const app = require("./app");

const { PORT } = process.env;

app.listen(PORT, () => {
	console.log(`Server started running successfully at PORT ${PORT}`);
});
