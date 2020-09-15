module.exports = function (sequelize, DataTypes) {
	return sequelize.define('configuration', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: true
			}
        },
        isOriginal: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        layerNum: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
        layerShape: {
            type: DataTypes.JSON
        },
        activationFunction: {
            type: DataTypes.TEXT,
			allowNull: false
        },
        regulation: {
            type: DataTypes.TEXT,
			allowNull: false
        },
        learningRate: {
            type: DataTypes.FLOAT,
			allowNull: false
        }
	});
};

