# Project Title

[[_TOC_]]

## Team Members
1. Fredrik Nyström
1. Patrick Möcke
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
We will work with boxscore data from the two most recent seasons. To make this high-dimensional dataset easier to visualize and work with, we will train a machine-learning model to project the data into a lower-dimensional space while trying to conform to the scout’s mental model.

### Tasks
TODO: Define all the tasks you want your dashboard solve.

- - -
## Folder Structure
Specify here the structure of you code and comment what the most important files contain

``` bash
├── README.md  
├── backend-project
│   ├── setup.py   # main app
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── MANIFEST.in
│   ├── README.md
│   ├── pyproject.toml
│   ├── data
│   │   ├── ames-housing-features.json
│   │   ├── ames-housing-gam-instance-data.json
│   │   └── ames-housing-gam.json
│   └── src/gamut_server
│       ├── resources
│       │   ├── __init__.py
│       │   ├── description.py
│       │   ├── features.py
│       │   └── instances.py
│       ├── router
│       │   ├── __init__.py
│       │   ├── app.py
│       │   └── routes.py
│       └── __init__.py
├── react-frontend
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── Visualization.tsx
│   │   ├── backend
│   │   │   ├── BackendQueryEngine.tsx
│   │   │   └── json-decoder.ts
│   │   ├── components
│   │   │   ├── BasicLineChart
│   │   │   │   ├── BasicLineChart.scss
│   │   │   │   ├── BasicLineChart.tsx
│   │   │   │   └── types.ts
│   │   │   ├── DataChoiceComponent.tsx
│   │   │   ├── DataPointComponent.tsx
│   │   │   └── ScatterPlot
│   │   │       ├── ScatterPlot.scss
│   │   │       ├── ScatterPlot.tsx
│   │   │       └── types.ts
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   ├── setupTests.ts
│   │   └── types
│   │       ├── DataArray.ts
│   │       ├── DataPoint.ts
│   │       └── Margins.ts
│   └── tsconfig.json
└── requirements.txt
```

## Requirements
Write here all intructions to build the environment and run your code.\
**NOTE:** If we cannot run your code following these requirements we will not be able to evaluate it.

## How to Run
Write here **DETAILED** intructions on how to run your code.\
**NOTE:** If we cannot run your code following these instructions we will not be able to evaluate it.

As an example here are the instructions to run the Dummy Project:
To run the Dummy project you have to:
- clone the repository;
- open a terminal instance and using the command ```cd``` move to the folder where the project has been downloaded;

To run the backend
- open the backend folder called "backend-project"
- to start the backend first you need to create a virtual environment using conda
    ```conda create -n nameOfTheEnvironment```
  - to activate the virtual environment run the command ```conda activate nameOfTheEnvironment```
  - install the requirements using the command ```pip3 install .```
  - If you want to make changes and test them in real time, you can install the package in editable mode using the command```pip install -e .```
  - to start the backend use the command ```python3 -m gamut_server.router.app``` or use the ```start-server``` command directly on your terminal

To run the frontend
- Open a new terminal window and go to the project folder
- Enter the frontend folder called "react-frontend"
- Do the following command to start the front end ```npm install```, ```npm start```
If all the steps have been successfully executed a new browser window witht he dummy project loaded will open automatically.

## Milestones
Document here the major milestones of your code and future planned steps. Create a list of subtasks here and open an issue in git for each subtask and link the corresponding issue. Create a merge request (with corresponding branch) from each issue. Finally accept the merge request once issue is resolved. Once you complete a task, link the corresponding merge commit. Take a look at [Issues and Branches](https://www.youtube.com/watch?v=DSuSBuVYpys) for more details. 

- [ ] Week 6
  - [ ] Sub-task: [Script to read data from excel to database](https://gitlab.inf.ethz.ch/course-xai-iml24/b-12-sign-player-basketball/-/issues/1)
  - [ ] Sub-task: [Create own dummy react component](https://gitlab.inf.ethz.ch/course-xai-iml24/b-12-sign-player-basketball/-/issues/2)
  - [ ] Sub-task: [Use figma and export test css files](https://gitlab.inf.ethz.ch/course-xai-iml24/b-12-sign-player-basketball/-/issues/3)
- [ ] Week 7



This will help you have a clearer overview of what you are currently doing, track your progress and organise your work among yourselves. Moreover it gives us more insights on your progress.  

## Weekly Summary 
Write here a short summary with weekly progress, including challanges and open questions.\
We will use this to understand what your struggles and where did the weekly effort go to.

#### W6


## Versioning
Create stable versions of your code each week by using gitlab tags. Take a look at [Gitlab Tags](https://docs.gitlab.com/ee/topics/git/tags.html) for more details and naming conventions at [Name your tag](https://git-scm.com/docs/git-check-ref-format).

We will evaluate your code every week, based on the corresponding version. Then list weekly tags here.

Tags:
- Week 5: [v0.0.1](https://gitlab.inf.ethz.ch/course-xai-iml24/b-12-sign-player-basketball/-/tags/v0.0.1)
- Week 6: 


