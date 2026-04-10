# Basketball Scouting

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
The target group of our project consists of general managers, coaches, and scouts of a Spanish basketball team. Our goal is to simplify and improve the decision-making process when signing new players by presenting the data in an organized manner and allowing the user to interact with it through sorting, filtering, searching, and head-to-head comparisons between players.
Our hope is that this tool can give users a competitive edge by improving their scouting process.

### Datasets
We will work with boxscore data from the three most recent seasons. To make this high-dimensional dataset easier to visualize and work with, we will train a machine-learning model to project the data into a lower-dimensional space while trying to conform to the scout’s mental model.

## Requirements
All requirements and dependencies are handled by the docker images so docker must be installed and running.


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
