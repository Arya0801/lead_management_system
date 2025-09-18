const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { PORT, MONGO_URI } = require('./config/env');

const server = http.createServer(app);

(async () => {
  try {
    await connectDB(MONGO_URI);
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Server failed to start', err);
    process.exit(1);
  }
})();
