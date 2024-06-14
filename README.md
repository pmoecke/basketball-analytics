# Project Title

[[_TOC_]]

## Team Members
1. Fredrik Nyström
1. Patrik Möcke
1. Dario Tenore
1. Yanik Künzi

## Project Description 
You can see our pitch video [here](https://polybox.ethz.ch/index.php/s/ALvekl35WUd7mhX)

As of now, signing new players relies on a lot of manual labor like watching tape and searching through overwhelmingly large and complex datasets. Furthermore, the scout’s intuition often plays a key role in deciding which players are signed.
The goal of our project is to allow basketball coaches and scouts to enhance their decision-making process using a data-driven approach. Additionally, we support them using machine learning and visualization techniques, which allow them to navigate these high-dimensional datasets more efficiently.

In particular, we want to figure out if such a system can capture the scout’s mental model.


### Users
The target group of our project consists of general managers, coaches, and scouts of the Spanish basketball team Obradoiro SAD. Our goal is to simplify and improve the decision-making process when signing new players by presenting the data in an organized manner and allowing the user to interact with it through sorting, filtering, searching, and head-to-head comparisons between players.
Our hope is that this tool can give users a competitive edge by improving their scouting process.

### Datasets
We will work with boxscore data from the three most recent seasons. To make this high-dimensional dataset easier to visualize and work with, we will train a machine-learning model to project the data into a lower-dimensional space while trying to conform to the scout’s mental model.

## Folder Structure
Specify here the structure of you code and comment what the most important files contain

``` bash
├── backend-project
│   ├── data
│   │   ├── data_raw
│   │   ├── aggregrate_data.py
│   │   ├── data_import.py
│   │   ├── generate_data.py
│   │   ├── import_scores.py
│   │   └── Players.db
│   ├── Dockerfile
│   ├── MANIFEST.in
│   ├── pyproject.toml
│   ├── README.md
│   ├── setup.py
│   └── src
│       └── dummy_server
│           ├── __init__.py
│           ├── resources
│           │   ├── __init__.py
│           │   ├── definitions.py
│           │   ├── overview_stats.py
│           │   ├── players.py
│           │   ├── projection_new.py
│           │   └── stats.py
│           └── router
│               ├── app.py
│               ├── __init__.py
│               └── routes.py
├── helm
│   ├── charts
│   ├── Chart.yaml
│   ├── files
│   ├── templates
│   │   ├── deployment.yaml
│   │   ├── ingress.yaml
│   │   └── service.yaml
│   └── values.yaml
├── react-frontend
│   ├── Dockerfile
│   ├── Dockerfile_local
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── components
│   │   │   ├── Comparison.tsx
│   │   │   ├── ComparisonGraph.tsx
│   │   │   ├── ComparisonModal.tsx
│   │   │   ├── CustomProjectionModal.tsx
│   │   │   ├── Filter.tsx
│   │   │   ├── FilterGraph.tsx
│   │   │   ├── Order.tsx
│   │   │   ├── Player2DGraph.tsx
│   │   │   ├── Player2DView.tsx
│   │   │   ├── PlayerDashboard.tsx
│   │   │   ├── PlayerGraph.tsx
│   │   │   ├── PlayerList.tsx
│   │   │   ├── PlayerModal.tsx
│   │   │   ├── PlayerSearch.tsx
│   │   │   ├── ProjectionDropdown.tsx
│   │   │   ├── SidebarFilter.tsx
│   │   │   └── TooltipOverlay.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   ├── router
│   │   │   ├── apiClient.ts
│   │   │   └── data.ts
│   │   ├── setupTests.ts
│   │   └── types
│   │       └── player.ts
│   └── tsconfig.json
└── README.md
```

## Requirements
All requirements and dependencies are handled by the docker images so docker must be installed and running.

## How to Run
Both the backend and frontend runs in docker environments
- Start docker
- Clone the repository: b-12-sign-player-basketball

### Run backend
First open a terminal in the project root and run
```cd backend-project```

Then simply build the image with 
```docker build . -t backend```

Lastly run the server on port 8000 with
```docker run -it -p 8000:8000 backend```

### Run frontend
First open second terminal in the project root and run
```cd react-frontend ```

Then simply build the image with 
```docker build -t frontend -f Dockerfile_local . ```

Then run the app on port 3000 with
```docker run -it -p 3000:3000 frontend```

Finally interact with the app on http://localhost:3000/

## Milestones
Document here the major milestones of your code and future planned steps. Create a list of subtasks here and open an issue in git for each subtask and link the corresponding issue. Create a merge request (with corresponding branch) from each issue. Finally accept the merge request once issue is resolved. Once you complete a task, link the corresponding merge commit. Take a look at [Issues and Branches](https://www.youtube.com/watch?v=DSuSBuVYpys) for more details. 

- [ ] Week 6
  - [ ] Sub-task: [Script to read data from excel to database](https://gitlab.inf.ethz.ch/course-xai-iml24/b-12-sign-player-basketball/-/issues/1)
  - [ ] Sub-task: [Create own dummy react component](https://gitlab.inf.ethz.ch/course-xai-iml24/b-12-sign-player-basketball/-/issues/2)
  - [ ] Sub-task: [Use figma and export test css files](https://gitlab.inf.ethz.ch/course-xai-iml24/b-12-sign-player-basketball/-/issues/3)


## Contributions
* Dario: Created, edited and voiced pitch video, which used sketches that were created by Fredrik and me. Created and edited dashboard layout together with Fredrik. Created radar charts and added functionality for dragging data points. Also help redo scatterplot with Chart.js and added pan, zoom, and highlight on hover functionality. Added tabbed, scrollable stat tables to player and comparison screens. In general, helped steer layout and design of frontend. While I often created individual parts for the frontend myself (e.g., radar chart, tables), most of my work was implemented together or with the help of Fredrik.
* Fredrik: I created sketches for the visuals of the app together with Dario. Wrote the code on the frontend that takes care of application logic such as current state of the app and requesting data from the api endpoints. Set up branch for the ci-cd-pipeline and pushed to production. 
* Yanik: I was in charge of setting up the backend, including merging the data from csv's into a SQLite databse which I set up and created the schema for. Also wrote the vast majority of the API endpoints with some inputs and small changes from other group members. Futhermore, I used the data preprocessed by Patrik to create the downprojections using t-SNE from the high-dimensional space, first only based on fixed features and later extending it to allow users to choose which features should be used for the projections.
* Patrik: Created the data pre-processing pipeline as described in the report, preparing the data to be used for the ML models. Developed the scoring metric (via clustering and and some cluster analysis) which is used in the Radar chart in the dashboard, and also used for filtering and sorting players. Did some stuff in the backend, e.g. creating the final "Stats" table for the database which included adding scores to the table and replacing the original, somehwat raw data, with the aggregated data (see report for aggregated data). My work in the backend was largely based off what Yanik already set up at the start of the project.