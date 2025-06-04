# GIschedule

This repository hosts a small Express server that serves the schedule web interface. The schedule data lives in two CSV files (`main_schedule.csv` and `call_schedule.csv`).

## Running the server

Install dependencies and start the server:

```bash
npm install
npm start
```

Once running, open the interface by navigating to `http://localhost:3000` in a browser.
The page relies on the server to load the CSV files, so opening `index.html` directly from the filesystem will display an empty schedule.

## Updating schedules

To modify the displayed schedules, edit `main_schedule.csv` or `call_schedule.csv` in this repository and restart the server. No upload endpoints are required—the server simply serves the files that are present on disk.

## Troubleshooting

Server logs are printed to stdout in the terminal running the server. If the page appears empty,
make sure you launched the app using `npm start` and opened `http://localhost:3000` in your browser.
After editing the CSV files, restart the server so the changes are picked up.
