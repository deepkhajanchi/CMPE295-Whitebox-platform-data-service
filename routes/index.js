const express = require('express');
const handlers = require('./handlers');
const bodyParser = require('body-parser');

let router = express.Router();

const jsonParser = bodyParser.json();

router.get('/datasets', handlers.getDatasets);
router.post('/datasets', jsonParser, handlers.createDataset);
router.get('/datasets/:datasetId', handlers.getDataset);
router.get('/datasets/:datasetId/items', handlers.getDatasetItems);
router.post('/datasets/:datasetId/items', jsonParser, handlers.createDatasetItem);
router.delete('/datasets/:datasetId/items/:datasetItemId', handlers.deleteDatasetItem);


router.get('/tests', handlers.getTests);
router.post('/tests', jsonParser, handlers.createTest);
router.delete('/tests', jsonParser, handlers.deleteTest);
router.get('/tests/:testId', jsonParser, handlers.getTest);
router.get('/tests/:testId/result', jsonParser, handlers.getTestResult);
router.get('/tests/:testId/result/layers/', handlers.getLayers);
router.get('/tests/:testId/result/layers/:layerId/neurons', handlers.getNeurons);
router.get('/tests/:testId/result/layers/:layerId/neurons/:neuronId', handlers.getSingleNeuronResult);


module.exports = router;