import app from "./app";
import configs from "./config";
const port = configs.port;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
  