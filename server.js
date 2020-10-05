const database = require("./database");
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;

const apiPath = "/api/v1.0"

database.sequelize.sync().then(() => {
    console.log("Successfully connect to database");

    app.get('/', (req, res) => {
        res.send('Landing page');
    })

    // app.get(`${apiPath}/:modelId/:configurationId/:layerId/:neuronId/:resultId/detail`, (req, res) => {
    // })

    app.get('/:modelId/:configurationId/:layerId/:neuronId/:resultId/detail', (req, res) => {
        const { modelId, configurationId, layerId, neuronId, resultId } = req.params;

        database.Neuron.findAll({
            where: {
                id: Number(neuronId)
            },
            include:[{
                model: database.Layer
            }]
        }).then(function(neurons){
            let neuron = neurons[0];
            if (!neuron){
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
                    include:[{
                        model: database.Layer
                    }]
                }]
            }).then(function(sourceNeurons){
                let nodeResults = [];
                new Promise(function(ok, ko){
                    if (sourceNeurons.length == 0){
                        return ok();
                    }

                    database.NodeResult.findAll({
                        where: {
                            id: sourceNeurons.map(function(item){ return item.source.id}),
                            resultId: resultId
                        }
                    }).then(function(nodeResults0){
                        nodeResults = nodeResults0;
                        return ok();
                    }, function(err){
                        return ko(err);
                    })
                }).then(function(){
                    let input = sourceNeurons.map(function(item){
                        let result = nodeResults.find(function(r){ return r.neuronId == item.source.id })
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
                            include:[{
                                model: database.Layer
                            }]
                        }]
                    }).then(function(destLinks){
                        let outputs = destLinks.map(function(destLink){
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
                            model:{
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
                }, function(err){
                    return res.status(500).send(err)
                })
            }, function(err){
                return res.status(500).send({
                    error: "INTERNAL_ERROR"
                })
            })

            
        }, function(err){
            return res.send(err);
        })
    })

    app.listen(port, () => {
        console.log(`Data Module is served at http://localhost:${port}`)
    })


}, (err) => {
    console.log("Connection Error: ", err);
})