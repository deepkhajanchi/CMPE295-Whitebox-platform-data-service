module.exports = function (sequelize, DataTypes) {
	return sequelize.define('layer', {
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
		type: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		}
	});
};

