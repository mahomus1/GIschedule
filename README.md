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

## Git integration

Uploaded files are committed to the repository automatically. The server attempts to push the commit if a git remote is configured. If no remote exists, the push step is skipped and a warning is logged, but the file upload and commit still succeed.

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
