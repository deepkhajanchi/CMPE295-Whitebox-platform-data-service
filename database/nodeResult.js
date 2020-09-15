module.exports = function (sequelize, DataTypes) {
	return sequelize.define('nodeResult', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		output: {
			type: DataTypes.FLOAT,
			allowNull: false
        },
        input: {
            type: DataTypes.JSONB,
            allowNull: false
        }
	});
};
