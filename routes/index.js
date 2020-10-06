const express = require('express');
const handlers = require('./handlers');
const bodyParser = require('body-parser');

let router = express.Router();

router.get('/tests', handlers.getTests);
router.post('/tests', bodyParser.json(), handlers.createTest);
router.delete('/tests', bodyParser.json(), handlers.deleteTest);
router.get('/tests/:testId', bodyParser.json(), handlers.getTest);
router.get('/tests/:testId/result', bodyParser.json(), handlers.getTestResult);
router.get('/tests/:testId/result/layers/', handlers.getLayers);
router.get('/tests/:testId/result/layers/:layerId/neurons', handlers.getNeurons);
router.get('/tests/:testId/result/layers/:layerId/neurons/:neuronId', handlers.getSingleNeuronResult);


module.exports = router;