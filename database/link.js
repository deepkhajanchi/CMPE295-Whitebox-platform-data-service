module.exports = function (sequelize, DataTypes) {
	return sequelize.define('link', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		weight: {
			type: DataTypes.FLOAT,
			allowNull: false,
        }        
	});
};

