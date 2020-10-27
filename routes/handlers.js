const database = require("../database");
const moment = require("moment");
const dataset = require("../database/dataset");

module.exports.getTests = function(req, res){
    database.Test.findAll({
        where: {
            profileId: 1
        }
    }).then(function(tests){
        return res.send({
            outputs: tests
        });
    }, function(err){
        return res.status(500).send(err);
    })
}

module.exports.getTest = function(req, res){
    const { testId } = req.params;
    database.Test.findAll({
        where: {
            id: testId,
            profileId: 1
        },
        include: [{
            model: database.Configuration,
            include: [{
                model: database.Model
            }]
        }]
    }).then(function(tests){
        if (tests.length == 0){
            return res.status(404).send({
                error: "NOT_FOUND"
            })
        }

        return res.send(tests[0]);
    }, function(err){
        return res.status(500).send(err);
    })
}

module.exports.getTestResult = function(req, res){
    const { testId } = req.params;
    database.Result.findAll({
        include: [{
            model: database.Test,
            where: {
                id: testId,
                profileId: 1
            }
        }]
    }).then(function(results){
        if (results.length == 0){
            return res.status(404).send({
                error: "NOT_FOUND"
            })
        }

        let result = results[0];

        return res.send(result);
    }, function(err){
        return res.status(500).send(err);
    })
}

module.exports.createTest = function(req, res){
    const {name, imageUrl, profileId} = req.body;

    // TODO: validate imageUrl

    database.Test.create({
        name,
        input: imageUrl, 
        status: "RUNNING",
        profileId: profileId,
        timestamp: moment()
    }).then(function(test){
        return res.send({
            status: "ok"
        });
    }, function(err){
        return res.status(500).send(err);
    })
}

module.exports.deleteTest = function(req, res){
    const {testId, profileId} = req.body;

    // TODO: validate imageUrl

    database.Test.destroy({
        where: {
            id: testId,
            profileId: profileId
        }
    }).then(function(test){
        return res.send({
            status: "ok"
        });
    }, function(err){
        return res.status(500).send(err);
    })
}

module.exports.getSingleNeuronResult = function (req, res) {
    const { modelId, configurationId, layerId, neuronId, testId } = req.params;

    database.Neuron.findAll({
        where: {
            id: Number(neuronId)
        },
        include: [{
            model: database.Layer
        }]
    }).then(function (neurons) {
        let neuron = neurons[0];
        if (!neuron) {
            return res.status(404).send({
                error: "NOT_FOUND"
            })
        }
        database.Link.findAll({
            where: {
                destId: neuron.id
            },
            include: [{
                model: database.Neuron,
                as: "source",
                include: [{
                    model: database.Layer
                }]
            }]
        }).then(function (sourceNeurons) {
            let nodeResults = [];
            new Promise(function (ok, ko) {
                if (sourceNeurons.length == 0) {
                    return ok();
                }

                database.Result.findAll({
                    include: [{
                        model: database.Test,
                        where: {
                            id: testId,
                            profileId: 1
                        }
                    }]
                }).then(function(results){
                    if (results.length == 0){
                        return handleNotFound();
                    }
                    let result = results[0];

                    database.NodeResult.findAll({
                        where: {
                            id: sourceNeurons.map(function (item) { return item.source.id }),
                            resultId: result.id
                        }
                    }).then(function (nodeResults0) {
                        nodeResults = nodeResults0;
                        return ok();
                    }, function (err) {
                        return ko(err);
                    })
                })
            }).then(function () {
                let input = sourceNeurons.map(function (item) {
                    let result = nodeResults.find(function (r) { return r.neuronId == item.source.id })
                    return {
                        id: item.source.id,
                        weight: item.weight,
                        value: result.output,
                        layer: {
                            id: item.source.layer.id,
                            name: item.source.layer.name
                        }
                    }
                })

                database.Link.findAll({
                    where: {
                        sourceId: neuron.id
                    },
                    include: [{
                        model: database.Neuron,
                        as: "dest",
                        include: [{
                            model: database.Layer
                        }]
                    }]
                }).then(function (destLinks) {
                    let outputs = destLinks.map(function (destLink) {
                        return {
                            id: destLink.dest.id,
                            weight: destLink.weight,
                            layer: {
                                id: destLink.dest.layer.id,
                                name: destLink.dest.layer.name
                            }
                        }
                    })

                    return res.send({
                        model: {
                            id: 1,
                            name: modelId
                        },
                        configuration: {
                            id: 1,
                            name: "Sample Configuration"
                        },
                        test: {
                            id: 1,
                            name: "First Test"
                        },
                        id: neuron.id,
                        bias: neuron.bias,
                        activationFunction: neuron.activationFunction,
                        output: 0.21,
                        layer: {
                            id: neuron.layer.id,
                            name: neuron.layer.name
                        },
                        input: input,
                        outputs: outputs
                    });
                })
            }, function (err) {
                return res.status(500).send(err)
            })
        }, function (err) {
            return res.status(500).send({
                error: "INTERNAL_ERROR"
            })
        })


    }, function (err) {
        return res.send(err);
    })
}

module.exports.getLayers = function (req, res) {
    const { testId } = req.params;
    const { offset = 0, limit = 10 , type} = req.query;

    function handleDBError(){
        return res.status(500).send(err);
    }

    function handleNotFound(){
        return res.status(404).send(err);
    }

    database.Test.findAll({
        where: {
            id: testId,
            profileId: 1
        },
        include: [{
            model: database.Configuration
        }]
    }).then(function(tests){
        if (tests.length == 0){
            return handleNotFound();
        }

        let test = tests[0];

        let layerQuery = {
            configurationId: test.configuration.id
        }

        if (type)
            layerQuery.type = type;

        database.Layer.findAll({
            offset: offset,
			limit: limit + 1,
            where: layerQuery
        }).then(function(layers){
            return res.send({
                data: layers.slice(0, limit).map(function(l){
                    return {
                        id: l.id,
                        name: l.name,
                        type: l.type,
                        data: l.data
                    }
                }),
                pagination: {
                    currentOffset: Number(offset),
                    limit: Number(limit),
                    hasNext: layers.length > limit,
                    hasPrev: offset > 0
                }
            })
        }, handleDBError)
    }, handleDBError)
}

module.exports.getNeurons = function(req, res){
    const { testId, layerId } = req.params;
    const { offset = 0, limit = 10 , type, minBias, maxBias, minOutput, maxOutput } = req.query;

    function handleDBError(){
        return res.status(500).send(err);
    }

    function handleNotFound(){
        return res.status(404).send(err);
    }

    database.Result.findAll({
        include: [{
            model: database.Test,
            where: {
                id: testId,
                profileId: 1
            }
        }]
    }).then(function(results){
        if (results.length == 0){
            return handleNotFound();
        }

        let result = results[0];

        database.Layer.findAll({
            where: {
                id: layerId
            }
        }).then(function(layers){
            if (layers.length == 0){
                return handleNotFound();
            }
            let layer = layers[0];

            let nodeResultWhere = {
                resultId: result.id
            }

            if (!isNaN(minOutput)){
                nodeResultWhere.output = nodeResultWhere.output || {};
                nodeResultWhere.output.$gte = Number(minOutput);
            }

            if (!isNaN(maxOutput)){
                nodeResultWhere.output = nodeResultWhere.output || {};
                nodeResultWhere.output.$lte = Number(maxOutput);
            }

            database.NodeResult.findAll({
                offset: offset,
                limit: limit + 1,
                where: nodeResultWhere,
                include: [{
                    model: database.Neuron,
                    where: {
                        layerId: layer.id
                    }
                }]
            }).then(function(nodeResults){
                return res.send({
                    data: nodeResults.slice(0, limit).map(function(nr){
                        return {
                            id: nr.neuron.id,
                            output: nr.output
                        }
                    }),
                    pagination: {
                        currentOffset: Number(offset),
                        limit: Number(limit),
                        hasNext: nodeResults.length > limit,
                        hasPrev: offset > 0
                    }
                })
            }, handleDBError)
        }, handleDBError)
    }, handleDBError)
}

module.exports.getDatasets = function(req, res){
    const { offset = 0, limit = 10 , name } = req.query;

    database.Dataset.findAll({
        offset: offset,
        limit: limit + 1,
        where: {
           profileId: 1
        }
    }).then(function(datasets){
        return res.send({
            data: datasets,
            pagination: {
                currentOffset: Number(offset),
                limit: Number(limit),
                hasNext: datasets.length > limit,
                hasPrev: offset > 0
            }
        })
    }, function (err){
        return res.status(500).send(err);
    })
}

module.exports.getDataset = function(req, res){
    const { datasetId } = req.params;
    

    function handleDBError(){
        return res.status(500).send(err);
    }

    function handleNotFound(){
        return res.status(404).send(err);
    }

    database.Dataset.findAll({
        where: {
           profileId: 1,
           id: datasetId
        }
    }).then(function(datasets){
        if (datasets.length == 0){
            return handleNotFound();
        }

        const dataset = datasets[0]; 

        return res.send(dataset)
    }, function (err){
        return res.status(500).send(err);
    })
}

module.exports.createDataset = function(req, res){
    const { name } = req.body;

    if (!name){
        return res.status(400).send({
            error: "MISSING_REQUIRED_NAME"
        })
    }
    
    database.Dataset.create({
        name,
        profileId: 1
    }).then(function(dataset){
        return res.status(201).send(dataset);
    }, function(err){
        return res.status(500).send(err);
    })
}

module.exports.createDatasetItem = function(req, res){
    const { datasetId } = req.params;
    const { url } = req.body;

    if (!url){
        return res.status(400).send({
            error: "MISSING_REQUIRED_URL"
        })
    }

    database.Dataset.findAll({
        where: {
           profileId: 1,
           id: datasetId
        }
    }).then(function(datasets){
        if (datasets.length == 0){
            return res.send({
                error: "DATASET_NOT_FOUND"
            });
        }
    
        database.DatasetItem.create({
            url,
            datasetId: datasets[0].id
        }).then(function(datasetItem){
            return res.status(201).send(datasetItem);
        }, function(err){
            return res.status(500).send(err);
        })
    })
}

module.exports.deleteDatasetItem = function(req, res){
    const { datasetId, datasetItemId } = req.params;
    database.DatasetItem.destroy({
        where: {
            id: datasetItemId,
            datasetId: datasetId
        }
    }).then(function(){
        return res.send({
            status: "ok"
        });
    }, function(err){
        return res.status(500).send(err);
    })
}

module.exports.getDatasetItems = function(req, res){
    const { datasetId } = req.params;

    database.DatasetItem.findAll({
        where: {
           datasetId: datasetId
        }
    }).then(function(datasetItems){
        return res.send(datasetItems)
    }, function (err){
        return res.status(500).send(err);
    })
}