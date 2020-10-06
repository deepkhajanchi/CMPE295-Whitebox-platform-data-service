module.exports = function (sequelize, DataTypes) {
	return sequelize.define('test', {
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
		status: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: true
			}
        },
        input: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: true
			}
        },
        timestamp: {
            type: 'TIMESTAMP',
            allowNull: false
        }
	});
};

