# GIschedule

This repository hosts an Express server used for uploading schedule CSV files and serving a simple web interface.

## Running the server

Install dependencies and start the server:

```bash
npm install
npm start
```

## Uploading schedule files

Send a POST request to `/upload/:type` with `type` being either `main` or `call`. The request must include a `file` field containing the CSV and a `password` field set to `mizzou`.

Example using `curl`:

```bash
curl -F "file=@main_schedule.csv" -F "password=mizzou" http://localhost:3000/upload/main
```

Another example for uploading the call schedule:

```bash
curl -F "file=@call_schedule.csv" -F "password=mizzou" http://localhost:3000/upload/call
```

## Git integration

Uploaded files are committed to the repository automatically. To have these commits pushed to another repository, first configure a remote on the server:

```bash
git remote add origin <url>
# optionally push your current branch to establish the upstream
git push -u origin main
```

After each successful upload the server runs `git push`. Pushing only happens when a git remote is configured and accessible; otherwise the push step is skipped and a warning is logged, but the file upload and commit still succeed.

If the uploaded CSV is identical to the version already checked into the repository, the server logs `No changes to commit` and skips creating a new commit or push. The upload still succeeds and the same success message is returned.

The API always responds with:

```
File uploaded. Repository updated.
```

This indicates the CSV was saved and committed. If a remote is configured, the commit is also pushed.

## Troubleshooting

Server logs are printed to stdout in the terminal running the server. The client
only displays `Upload failed` when the server responds with an error status.
Common causes include:

- The provided password is incorrect.
- Git is not installed on the machine.
- The repository was never initialized with `git init`.
