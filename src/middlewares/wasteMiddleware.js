exports.WasteMiddleware = {
	calculateTotalMiddleware: (req, res, next) => {
		const { building_name, weight } = req.body
        
		const total = waste.reduce((acc, cur) => acc + cur.amount, 0);
		req.body.total = total;
		next();
	},
	calculateAverageMiddleware: (req, res, next) => {
		const { body } = req;
		const { waste } = body;
		const total = waste.reduce((acc, cur) => acc + cur.amount, 0);
		const average = total / waste.length;
		req.body.average = average;
		next();
	},
	calculateMonthlyMiddleware: (req, res, next) => {
		const { body } = req;
		const { waste } = body;
		const total = waste.reduce((acc, cur) => acc + cur.amount, 0);
		const monthly = total / 30;
		req.body.monthly = monthly;
		next();
	},
	createDateId: () => {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		return `${year}-${month}-${day}`;
	}
};
