const Sequelize = require('sequelize');
const CONF = require('../config/config');

const sequelize = new Sequelize(CONF.DB.DATABASE, CONF.DB.USER, CONF.DB.PASSWORD, {
	host: CONF.DB.HOST,
	port: CONF.DB.PORT,
	dialect: CONF.DB.DIALECT,
	define: {
	    charset: 'utf8',
    	collate: 'utf8_general_ci'
	}
});

const POLL = sequelize.define('polls', {
	name: {
		type: Sequelize.STRING(255),
		allowNull: false
	},
	description: {
		type: Sequelize.TEXT,
	},
	multyCheckLimit: {
		type: Sequelize.INTEGER,
		defaultValue: 1
	},
	tags: {
		type: Sequelize.STRING(32),
		allowNull: false
	},
	expireDate: {
		type: Sequelize.STRING(12),
		allowNull: false
	},
	expireTime: {
		type: Sequelize.STRING(12),
		allowNull: false
	},
	count: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	likeCount: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	commentCount: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	activeFlag: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
}, {
	indexes: [{
		unique: true,
		fields: [ 'userId', 'name' ]
	}]
});

const OPTION = sequelize.define('options', {
	name: {
		type: Sequelize.STRING(255),
		allowNull: false
	},
  count: {
    type: Sequelize.INTEGER
  }
}, {
	timestamps: false,
	indexes: [{
		unique: true,
		fields: [ 'pollId', 'name' ]
	}]
});

      // primaryKey: true,
      // type: DataTypes.UUID,
      // defaultValue: DataTypes.UUIDV4,

const ATTACHMENT = sequelize.define('attachments', {
  id: {
  	primaryKey: true,
  	type: Sequelize.UUID
  },
  storage: {
    type: Sequelize.STRING(255)
  },
  originName: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  mimeType: {
    type: Sequelize.STRING(32)
  },
  path: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  size: {
    type: Sequelize.INTEGER
  },
  tags: {
  	type: Sequelize.STRING(64)
  }
});

const USER = sequelize.define('users', {
	name: {
		type: Sequelize.STRING(24),
		allowNull: false
	},
	email: {
		type: Sequelize.STRING(30),
		allowNull: false
	},
	birthDate: {
		type: Sequelize.STRING(12)
	},
	gender: {
		type: Sequelize.STRING(20)
	},
	tags: {
		type: Sequelize.TEXT
	},
	level: {
		type: Sequelize.INTEGER(255),
		defaultValue: 1,
		allowNull: false
	},
	coin: {
		type: Sequelize.INTEGER(255),
		defaultValue: 0,
		allowNull: false
	},	
	encryptedPassword: {
		type: Sequelize.STRING(255),
		allowNull: false
	},
	salt: {
		type: Sequelize.STRING(255),
		allowNull: false
	},
	activeCode: {
		type: Sequelize.STRING(8)
	},	
	active: {
		type: Sequelize.BOOLEAN,
		allowNull: true,
		defaultValue: false
	}
}, {
	indexes: [{
		unique: true,
		fields: [ 'name', 'email' ]
	}]
});

const COMMENT = sequelize.define('comments', {
	content: {
		type: Sequelize.STRING(255),
		allowNull: false
	}
}, {
	indexes: [{
		unique: true,
		fields: [ 'userId', 'content' ]
	}]
});

const ACTIVE_CODE = sequelize.define('activeCodes', {

})

USER.hasMany(COMMENT);
POLL.hasMany(COMMENT);
USER.hasMany(POLL);
POLL.hasMany(OPTION);
ATTACHMENT.hasMany(POLL);
ATTACHMENT.hasMany(OPTION);
ATTACHMENT.hasMany(USER);

sequelize.sync({
	force: true
});
