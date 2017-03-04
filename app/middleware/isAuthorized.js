"use strict";

module.exports = ( role => {

	return ((req, res, next) => {

		if ( req.user && req.user.roles === role) {

		  next();
		} else {

		  return res.sendStatus(401);
		}
	});
});
