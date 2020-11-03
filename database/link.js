module.exports = function (sequelize, DataTypes) {
	return sequelize.define('link', {
		id: {
			type: DataTypes.TEXT,
			allowNull: false,
			primaryKey: true
		},
		weight: {
			type: DataTypes.FLOAT,
			allowNull: false,
        }        
	});
};

