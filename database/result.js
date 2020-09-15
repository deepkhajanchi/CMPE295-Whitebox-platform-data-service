module.exports = function (sequelize, DataTypes) {
	return sequelize.define('result', {
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
        timestamp: {
            type: 'TIMESTAMP',
            allowNull: false
        },
        confusionMatrix: {
            type: DataTypes.JSONB
        },
        loss: {
            type: DataTypes.FLOAT
        },
        accuracy: {
            type: DataTypes.FLOAT
        }
	});
};
