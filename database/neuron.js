module.exports = function (sequelize, DataTypes) {
	return sequelize.define('neuron', {
		id: {
			type: DataTypes.TEXT,
			allowNull: false,
			primaryKey: true
		},
		bias: {
			type: DataTypes.FLOAT,
			allowNull: false,
        },
        type: {
            type: DataTypes.TEXT,
            allowNull: false,
		},
		activationFunction: {
            type: DataTypes.TEXT,
            allowNull: false,
		}
	});
};

