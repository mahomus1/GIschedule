const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });
const app = express();

const REPO_DIR = path.resolve(__dirname);

async function ensureGitRepo() {
  const gitDir = path.join(REPO_DIR, '.git');
  if (!fs.existsSync(gitDir)) {
    await execAsync('git init', { cwd: REPO_DIR });
  }
  let name = '';
  let email = '';
  try {
    const { stdout } = await execAsync('git config user.name', { cwd: REPO_DIR });
    name = stdout.trim();
  } catch (_) {}
  try {
    const { stdout } = await execAsync('git config user.email', { cwd: REPO_DIR });
    email = stdout.trim();
  } catch (_) {}
  if (!name) {
    await execAsync('git config user.name "Server User"', { cwd: REPO_DIR });
  }
  if (!email) {
    await execAsync('git config user.email "server@example.com"', { cwd: REPO_DIR });
  }
}

ensureGitRepo().catch(err => {
  console.error('Failed to initialize git repository:', err);
});

app.use(express.static(REPO_DIR));

app.post('/upload/:type', upload.single('file'), async (req, res) => {
  const { type } = req.params;
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
    await execAsync(`git add ${targetFile}`, { cwd: REPO_DIR });
    let changes = true;
    try {
      await execAsync('git diff --cached --quiet', { cwd: REPO_DIR });
      changes = false;
    } catch (_) {
      changes = true;
    }

    if (changes) {
        await execAsync(`git commit -m "Update ${targetFile} via upload"`, { cwd: REPO_DIR });
      let remote = '';
      try {
        const { stdout } = await execAsync('git remote', { cwd: REPO_DIR });
        remote = stdout.trim();
      } catch (remoteErr) {
        console.warn('Could not check git remote:', remoteErr.message);
      }

      if (remote) {
        try {
          await execAsync('git push', { cwd: REPO_DIR });
        } catch (pushErr) {
          console.warn('Git push failed:', pushErr.message);
        }
      } else {
        console.warn('No git remote configured. Skipping push.');
      }
    } else {
      console.log('No changes to commit.');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error updating repository.');
  }

  res.send('File uploaded. Repository updated.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
