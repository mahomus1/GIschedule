const express = require('express');
const multer = require('multer');
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });
const app = express();

const REPO_DIR = path.resolve(__dirname);

app.use(express.static(REPO_DIR));

app.post('/upload/:type', upload.single('file'), (req, res) => {
  const { type } = req.params;
  const { password } = req.body;
  if (password !== 'mizzou') {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(403).send('Invalid password.');
  }
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  let targetFile;
  if (type === 'main') {
    targetFile = 'main_schedule.csv';
  } else if (type === 'call') {
    targetFile = 'call_schedule.csv';
  } else {
    return res.status(400).send('Invalid type.');
  }

  const targetPath = path.join(REPO_DIR, targetFile);
  fs.renameSync(req.file.path, targetPath);

  try {
    execSync(`git add ${targetFile}`, { cwd: REPO_DIR });
    execSync(`git commit -m "Update ${targetFile} via upload"`, { cwd: REPO_DIR });
    execSync('git push', { cwd: REPO_DIR });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error updating repository.');
  }

  res.send('File uploaded and repository updated.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
