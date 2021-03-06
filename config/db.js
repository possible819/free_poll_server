const Sequelize = require("sequelize");
const CONF = require("./config");

const sequelize = new Sequelize(
  CONF.DB.DATABASE,
  CONF.DB.USER,
  CONF.DB.PASSWORD,
  {
    host: CONF.DB.HOST,
    port: CONF.DB.PORT,
    dialect: CONF.DB.DIALECT,
    define: {
      charset: "utf8",
      collate: "utf8_general_ci"
    }
  }
);

const db = {
  Sequelize: Sequelize,
  sequelize: sequelize
};

sequelize.sync({
  force: CONF.DB.SYNC
});

// Model List
db.Attachment = require("../models/Attachment")(sequelize, Sequelize);
db.User = require("../models/User")(sequelize, Sequelize);
db.Menu = require("../models/Menu")(sequelize, Sequelize);
db.Poll = require("../models/Poll")(sequelize, Sequelize);
db.PollHistory = require("../models/PollHistory")(sequelize, Sequelize);
db.LikeHistory = require("../models/LikeHistory")(sequelize, Sequelize);
db.Comment = require("../models/Comment")(sequelize, Sequelize);
db.CommentDetail = require("../models/CommentDetail")(sequelize, Sequelize);
db.Option = require("../models/Option")(sequelize, Sequelize);

module.exports = db;
