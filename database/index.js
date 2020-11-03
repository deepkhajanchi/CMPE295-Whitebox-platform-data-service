const Sequelize = require('sequelize')

let db = {};
let db_url = process.env.DATABASE_URL || "postgres://postgres:root@localhost:5432/cmpe295b_v4";


if (!db_url) {
    console.log("No connection string found");
}
else {
    console.log(`Connecting to database with connection string "${db_url}"`);
    
    const sqlregex = /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
    const match = db_url.match(sqlregex);

    if (match && match.length == 6) {
        let user = match[1];
        let password = match[2];
        let host = match[3];
        let port = match[4];
        let dbname = match[5];

        const Op = Sequelize.Op;
        const operatorsAliases = {
            $eq: Op.eq,
            $ne: Op.ne,
            $gte: Op.gte,
            $gt: Op.gt,
            $lte: Op.lte,
            $lt: Op.lt,
            $not: Op.not,
            $in: Op.in,
            $notIn: Op.notIn,
            $is: Op.is,
            $like: Op.like,
            $notLike: Op.notLike,
            $iLike: Op.iLike,
            $notILike: Op.notILike,
            $regexp: Op.regexp,
            $notRegexp: Op.notRegexp,
            $iRegexp: Op.iRegexp,
            $notIRegexp: Op.notIRegexp,
            $between: Op.between,
            $notBetween: Op.notBetween,
            $overlap: Op.overlap,
            $contains: Op.contains,
            $contained: Op.contained,
            $adjacent: Op.adjacent,
            $strictLeft: Op.strictLeft,
            $strictRight: Op.strictRight,
            $noExtendRight: Op.noExtendRight,
            $noExtendLeft: Op.noExtendLeft,
            $and: Op.and,
            $or: Op.or,
            $any: Op.any,
            $all: Op.all,
            $values: Op.values,
            $col: Op.col
        };

        let config = {
            dialect: 'postgres',
            protocol: 'postgres',
            port: port,
            host: host,
            operatorsAliases: operatorsAliases,
            dialectOptions: {
                charset: 'utf8mb4'
            },
            define: {},
            logging: process.env.LOG_SEQUELIZE == "1",
            syncOnAssociation: true,
            pool: {
                max: 5,
                min: 0,
                acquire: 20000,
                idle: 20000
            },
            maxConcurrentQueries: 150,
            language: 'en'
        };


        // connect to database
        let sq = new Sequelize(dbname, user, password, config);

        db = {
            Sequelize: Sequelize,
            sequelize: sq,
            Model: require(__dirname + '/model')(sq, Sequelize.DataTypes),
            Configuration: require(__dirname + '/configuration')(sq, Sequelize.DataTypes),
            Layer: require(__dirname + '/layer')(sq, Sequelize.DataTypes),
            Neuron: require(__dirname + '/neuron')(sq, Sequelize.DataTypes),
            Link: require(__dirname + '/link')(sq, Sequelize.DataTypes),
            Profile: require(__dirname + '/profile')(sq, Sequelize.DataTypes),
            Test: require(__dirname + '/test')(sq, Sequelize.DataTypes),
            Result: require(__dirname + '/result')(sq, Sequelize.DataTypes),
            NodeResult: require(__dirname + '/nodeResult')(sq, Sequelize.DataTypes),
            Dataset: require(__dirname + '/dataset')(sq, Sequelize.DataTypes),
            DatasetItem: require(__dirname + '/datasetItem')(sq, Sequelize.DataTypes),
        };

        db.Configuration.belongsTo(db.Model);
        db.Layer.belongsTo(db.Configuration);
        db.Neuron.belongsTo(db.Layer);

        db.Link.belongsTo(db.Neuron, { as: 'source' });
        db.Link.belongsTo(db.Neuron, { as: 'dest' });
        
        db.Neuron.hasMany(db.Link, { as: 'inputLinks' });
        db.Neuron.hasMany(db.Link, { as: 'outputLinks' });

        db.Test.belongsTo(db.Profile);
        db.Test.belongsTo(db.Configuration);

        db.Dataset.belongsTo(db.Profile);
        db.Dataset.hasMany(db.DatasetItem, { as: 'items' });

        db.DatasetItem.belongsTo(db.Dataset);

        db.Result.belongsTo(db.Test);

        db.NodeResult.belongsTo(db.Result);
        db.NodeResult.belongsTo(db.Neuron);
    }
}

module.exports = db;


