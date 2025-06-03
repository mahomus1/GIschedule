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

The API always responds with:

```
File uploaded. Repository updated.
```

This indicates the CSV was saved and committed. If a remote is configured, the commit is also pushed.
