const express = require('express');
const path = require('path');

const app = express();
const REPO_DIR = path.resolve(__dirname);

app.use(express.static(REPO_DIR));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
