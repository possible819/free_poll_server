/**
 * Poll Controller
 */
var multer = require('multer');
var thumbnailUpload = multer({ dest: './uploads/thumbnails' });

module.exports = function(app, db) {
	db.Poll.belongsTo(db.User);
	db.Option.belongsTo(db.Poll);

	app.post('/polls', thumbnailUpload.single('thumbnail'), (req, res) => {
    var userId = req.session.userId;
    var name = req.body.name;
		var description = req.body.description;
		var expireDate = req.body.expireDate;
		var expireTime = req.body.expireTime;
		var tags = req.body.tags;
		var multyCheckLimit = req.body.multyCheckLimit;

    var fileInfo = res.req.file;
    var data = {
      id: fileInfo.filename,
      storage: fileInfo.fieldname,
      originName: fileInfo.originalname,
      mimeType: fileInfo.mimetype,
      path: fileInfo.path,
      size: fileInfo.size
    };

    db.Attachment.create(data).then(attachment => {
    	var attachmentId = attachment.id;
    	
    	return db.Poll.create({
				name: name,
				description: description,
				expireDate: expireDate,
				expireTime: expireTime,
				tags: tags,
				multyCheckLimit: parseInt(multyCheckLimit),
				userId: userId,
				attachmentId: attachmentId
    	})
    }).then(poll => {
    	res.send(poll);
    }).catch(error => {
    	console.error(error);
    	throw error;
    });
	});

	app.get('/polls', (req, res) => {
		var joinPollIds = [];
		var userId = req.session.userId;

		db.PollHistory.findAll({
			where: { userId: userId }
		}).then(joinPollList => {
			joinPollList.forEach(function(joinPoll) {
				joinPollIds.push(joinPoll.pollId);
			});

			var condition = {};
			if(req.query.name) condition.name = { $like: '%' + req.query.name + '%'	};
			if(req.query.tags) condition.tags = req.query.tags;
			condition.userId = { $ne: req.session.userId };
			condition.activeFlag = true;

			return db.Poll.findAll({
				where: condition,
				include: [{ model: db.User, attributes: ['name', 'level', 'attachmentId']}]
			});
		}).then(polls => {
			joinPollIds.forEach(function(joinPollId) {
				polls.forEach(function(poll) {
					if(joinPollId == poll.id) poll.dataValues.join = true;
				})
			});
			res.send(polls);
		}).catch(error => {
			console.error(error);
			res.send(false);
		})
	})

	app.get('/polls/my_polls', function(req, res) {
		db.Poll.findAll({
			where: { userId: req.session.userId },
			include: [{
				model: db.User,
				attributes: ['name', 'level', 'attachmentId']
			}]
		}).then(function(polls) {
			res.send(polls);
		}).catch(error => {
			console.error(error);
			throw error;
		})
	}),

	app.get('/polls/tags', function(req, res) {
		db.User.findById(req.session.userId).then(userInfo => {
			if(userInfo.tags) {
				var orOper = [];
				var wrapper = {};				
				var tags = userInfo.tags.replace(/,\s/g, ',');

				var tagList = tags.split(',');
				tagList.forEach(function(tag) {
					wrapper.tags = {
						$like: '%' + tag + '%'
					};

					orOper.push(wrapper);
				});

				return db.Poll.findAll({
					where: { $or: orOper },
					include: [{ model: db.User, attributes: ['name', 'level', 'attachmentId']}]
				});
			} else {
				return null;
			}
		}).then(polls => {
			res.send(polls);
		}).catch(error => {
			throw error;
		})
	});

	app.get('/polls/top/:limit', function(req, res) {
		db.Poll.findAll({
			order: [
				['count', 'desc']
			],
			limit: parseInt(req.params.limit),
			include: [{ model: db.User, attributes: ['name', 'level', 'attachmentId']}]
		}).then( polls => {
			res.status(200).send(polls);
		}).catch(error => {
			throw error;
		})
	}),	

	app.get('/polls/:id', function(req, res) {
		db.Poll.find({
			where: req.params,
			include: [{ model: db.User, attributes: ['name', 'level', 'attachmentId']}]
		}).then(function(poll) {
			res.send(poll);
		}, function(error) {
			throw error;
		})
	}),

	app.post('/polls/active/:id', (req, res) => {
		db.Poll.update(req.body, { where: req.params}).then(poll => {
			res.send(poll);
		}).catch(error => {
			console.error(error);
			res.send(false);
		})
	}),

	app.delete('/polls/:id', (req, res) => {
		db.Poll.findOne({
			where: req.params,
			include: [{ model: db.User, attributes: ['name', 'level', 'attachmentId']}]
		}).then(poll => {
			return db.Question.findAll({
				where: { pollId: req.params.id }
			})
		}).then(questions => {
			var questionIds = [];
			questions.forEach(function(question) {
				questionIds.push(question.id);
			});
			return db.Option.destroy({	where: { questionId: questionIds }})
		}).then(() => {
			return db.Question.destroy({ where: { pollId: req.params.id }})
		}).then(() => {
			return db.Poll.destroy({ where: { id: req.params.id }})
		}).then(() => {
			return db.PollHistory.destroy({	where: { pollId: req.params.id }})
		}).then(() => {
			res.send(true);
		}).catch(error => {
			console.error(error);
			res.send(false);
		})
	})
};
