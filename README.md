# Routrill

This project was implemented for the [IT Talents Code Competition](https://www.it-talents.de/foerderung/code-competition/code-competition-04-2018).

## Try it out
* Clone the git repository.
* Run `npm install`.
* Run `npm start`.
* Navigate to `http://localhost:4200/`.

Alternatively checkout the project's [website](https://kimkern.de/tsp)

Also try it on your mobile device or the developer tool's mobile view in your desktop browser.

## Run tests
* Unittests: `npm test`
* Webtests: `npm start`, then `npm run e2e-dev`

## Project structure
The application code can be found under `src/app` and includes four submodules.

### app
The app module includes the root bootstrapping, navigation and the home / about pages.

### maps
The maps module includes the components for viewing end editing the **destinations**, as well as the component for viewing the four different **routes**.
The services encapsulate the used Google Maps APIs as well as the interface for the communication with the route-algorithm web workers.

### route-algorithms
This part is separate from the Angular application. It includes four web workers that calculate the different routes using different algorithms. Web workers are used for multi threading so that the UI thread is not blocked while the routes are computed. Especially the brute force algorithm can take a while with 10 destinations as input.

### util
The util module includes layout components and reexports used UI libraries to make them available in  any other part of the application.
