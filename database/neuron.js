module.exports = function (sequelize, DataTypes) {
	return sequelize.define('neuron', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
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
        
	});
};

