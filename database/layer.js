module.exports = function (sequelize, DataTypes) {
	return sequelize.define('layer', {
		id: {
			type: DataTypes.TEXT,
			allowNull: false,
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
		},
		data: {
			type: DataTypes.JSONB
		}
	});
};

