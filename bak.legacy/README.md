# Overview
Smart Farm Prediction is a system for sensing farm weather envirionment and prediction future environment and crop growth with Deep Learning.

# Prerequisites
* Node.js - [Download & install](https://nodejs.org/ko/download/)
* Python 3.8 or higher - [Download & install](https://www.python.org/downloads/)
* mariadb - [Download & install](https://mariadb.org/download)
* Redis - [Download & install](https://redis.io/download)
# Installing and building
Install Dependencies
```bash
$ npm install --prod
```
Build services
```bash
$ npm run build:all
```

# Running Services
```bash
$ node dist/api/main.js
$ node dist/sensor-processor/main.js
$ node dist/ai/main.js
```

Navigate to `http://localhost:8080/` for monitoring webapp.


### Acknowledgement
This work was supported by Institute of Information & communications Technology Planning & Evaluation (IITP) grant funded by the Korea government(MSIT) (No. 2021-0-00907, Development of Adaptive and Lightweight Edge-Collaborative Analysis Technology for Enabling Proactively Immediate Response and Rapid Learning).
