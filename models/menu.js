module.export(function() {
	const Menu = sequelize.define('menus', {
		rank: {
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		name: {
			type: Sequelize.STRING
		},
		url: {
			type: Sequelize.STRING
		}
	}, {
		timestamps: false
	});	
})
