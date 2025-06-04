# GIschedule

This repository hosts an Express server that serves a simple web interface for viewing rotation schedules.

## Running the server

Install dependencies and start the server:

```bash
npm install
npm start
```

Once running, open `http://localhost:3000` in a browser. The server looks for `main_schedule.csv` and `call_schedule.csv` in the repository root and serves them to the web page. Opening `index.html` directly from the filesystem will not load the schedules.

## Schedule CSVs

Edit the `main_schedule.csv` and `call_schedule.csv` files in this directory to update the displayed schedule. Restart the server to pick up changes.

## Troubleshooting

Server logs are printed to stdout in the terminal running the server. If the schedule fails to load, ensure the CSV files exist and the server is running.
