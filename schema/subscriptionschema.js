const UserSubscriptionModel = require("../models/subscription");
// const utils = require("../common/utils");
const {
	GraphQLDate,
	GraphQLTime,
	GraphQLDateTime,
} = require("graphql-iso-date");
const {
	GraphQLID,
	GraphQLString,
	GraphQLBoolean,
	GraphQLList,
	GraphQLSchema,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLInputObjectType,
} = require("graphql");

const Subscription = new GraphQLObjectType({
	name: "subscription",
	fields: {
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		details: { type: GraphQLString },
		amount: { type: GraphQLString },
		bottom_line: { type: GraphQLString },
		active: { type: GraphQLBoolean },
	},
});

const rootquery = new GraphQLObjectType({
	name: "Query",
	fields: {
		Subscription: {
			// name of the query is people by id
			type: new GraphQLList(Subscription),
			resolve: (root, args, context, info) => {
				return UserSubscriptionModel.find().exec();
			},
		},
		// SubscriptionByUserID: {
		// 	// name of the query is people by id
		// 	type: Subscription,
		// 	args: {
		// 		// strong validation for graphqlid, which is mendatory for running this query
		// 		userid: { type: GraphQLString },
		// 	},
		// 	resolve: (root, args, context, info) => {
		// 		// console.log(args);
		// 		return UserSubscriptionModel.findOne({
		// 			userid: args.userid,
		// 		}).exec();
		// 	},
		// },
	},
});

// const mutationType = new GraphQLObjectType({
// 	name: "Mutation",
// 	fields: {
// 		usersetting: {
// 			type: Subscription,
// 			args: {
// 				id: { type: GraphQLID },
// 				name: { type: GraphQLString },
// 				description: { type: GraphQLString },
// 				details: { type: GraphQLString },
// 				amount: { type: GraphQLString },
// 				bottom_line: { type: GraphQLString },
// 				active: { type: GraphQLBoolean },
// 			},
// 			resolve: (root, args, context, info) => {
// 				var usm = new UserSubscriptionModel(args);
// 				return usm.save();
// 			},
// 		},
// 		update: {
// 			type: Subscription,
// 			args: {
// 				userid: { type: GraphQLString },
// 				obj: { type: GraphQLString },
// 			},
// 			resolve: (root, args, context, info) => {
// 				var u = UserSubscriptionModel.findOne({ userid: args.userid }).then(
// 					(doc) => {
// 						// console.log(doc["general"][0]["language"]);
// 						// console.log(args.obj.includes("calendar"));
// 						// console.log("check", "general" in args.obj);
// 						if (args.obj.includes("general")) {
// 							doc["general"][0]["language"] = JSON.parse(args.obj)[
// 								"general"
// 							][0]["language"];
// 							doc["general"][0]["country"] = JSON.parse(args.obj)["general"][0][
// 								"country"
// 							];
// 							doc["general"][0]["dateformat"] = JSON.parse(args.obj)[
// 								"general"
// 							][0]["dateformat"];
// 							doc["general"][0]["timeformat"] = JSON.parse(args.obj)[
// 								"general"
// 							][0]["timeformat"];
// 							doc["general"][0]["timezone"] = JSON.parse(args.obj)[
// 								"general"
// 							][0]["timezone"];
// 							return doc;
// 						} else if (args.obj.includes("calendar")) {
// 							doc["calendar"][0]["sameeveryday"] = JSON.parse(args.obj)[
// 								"calendar"
// 							][0]["sameeveryday"];
// 							doc["calendar"][0]["days"] = JSON.parse(args.obj)["calendar"][0][
// 								"days"
// 							];
// 							doc["calendar"][0]["addlatefee"] = JSON.parse(args.obj)[
// 								"calendar"
// 							][0]["addlatefee"];
// 							doc["calendar"][0]["latefeesamount"] = JSON.parse(args.obj)[
// 								"calendar"
// 							][0]["latefeesamount"];
// 							doc["calendar"][0]["latefeesfrom"] = JSON.parse(args.obj)[
// 								"calendar"
// 							][0]["latefeesfrom"];
// 							doc["calendar"][0]["weekends"] = JSON.parse(args.obj)[
// 								"calendar"
// 							][0]["weekends"];
// 							doc["calendar"][0]["declinedappoinments"] = JSON.parse(args.obj)[
// 								"calendar"
// 							][0]["declinedappoinments"];
// 							doc["calendar"][0]["shorterappoinments"] = JSON.parse(args.obj)[
// 								"calendar"
// 							][0]["shorterappoinments"];
// 							doc["calendar"][0]["startsweek"] = JSON.parse(args.obj)[
// 								"calendar"
// 							][0]["startsweek"];
// 							return doc;
// 						} else if (args.obj.includes("appointment")) {
// 							doc["appointment"][0]["radius"] = JSON.parse(args.obj)[
// 								"appointment"
// 							][0]["radius"];
// 							doc["appointment"][0]["interval"] = JSON.parse(args.obj)[
// 								"appointment"
// 							][0]["interval"];
// 							doc["appointment"][0]["autoacceptbooking"] = JSON.parse(args.obj)[
// 								"appointment"
// 							][0]["autoacceptbooking"];
// 							doc["appointment"][0]["autoacceptconsult"] = JSON.parse(args.obj)[
// 								"appointment"
// 							][0]["autoacceptconsult"];
// 							return doc;
// 						} else if (args.obj.includes("notification")) {
// 							doc["notification"][0]["d_request_approval"] = JSON.parse(
// 								args.obj
// 							)["notification"][0]["d_request_approval"];
// 							doc["notification"][0]["d_apt_activity"] = JSON.parse(args.obj)[
// 								"notification"
// 							][0]["d_apt_activity"];
// 							doc["notification"][0]["d_conslt_request"] = JSON.parse(args.obj)[
// 								"notification"
// 							][0]["d_conslt_request"];
// 							doc["notification"][0]["d_new_message"] = JSON.parse(args.obj)[
// 								"notification"
// 							][0]["d_new_message"];
// 							doc["notification"][0]["e_request_approval"] = JSON.parse(
// 								args.obj
// 							)["notification"][0]["e_request_approval"];
// 							doc["notification"][0]["e_apt_activity"] = JSON.parse(args.obj)[
// 								"notification"
// 							][0]["e_apt_activity"];
// 							doc["notification"][0]["e_conslt_request"] = JSON.parse(args.obj)[
// 								"notification"
// 							][0]["e_conslt_request"];
// 							doc["notification"][0]["e_new_message"] = JSON.parse(args.obj)[
// 								"notification"
// 							][0]["e_new_message"];
// 							return doc;
// 						}
// 					}
// 				);
// 				u.then((value) => {
// 					// console.log(value);
// 					value.save();
// 				});
// 				// 	.then((doc) => {
// 				// 	console.log("mmm ", doc["general"][0]["language"]);
// 				// 	console.log("input", JSON.parse(args.obj)["general"][0]["language"]);
// 				// 	doc["general"][0]["language"] = JSON.parse(args.obj)["general"][0][
// 				// 		"language"
// 				// 	];

// 				// });
// 				// UserSubscriptionModel.find({ userid: args.userid }, function (err, user) {
// 				// 	console.log("h", user);
// 				// 	const obj = JSON.parse(args.obj);
// 				// 	let user1 = utils.getSubscription(user, obj);
// 				// 	//console.log(user);
// 				// 	console.log("h1", user1);
// 				// 	if (utils.keyExists("general", obj)) {
// 				// 		user.markModified("general");
// 				// 	}
// 				// 	if (utils.keyExists("calendar", obj)) {
// 				// 		user.markModified("calendar");
// 				// 	}
// 				// 	if (utils.keyExists("appointment", obj)) {
// 				// 		user.markModified("appointment");
// 				// 	}
// 				// 	if (utils.keyExists("notification", obj)) {
// 				// 		user.markModified("notification");
// 				// 	}
// 				// 	console.log(user);
// 				// 	user.save();

// 				// 	return user;
// 				// });
// 			},
// 		},
// 	},
// });

module.exports = new GraphQLSchema({
	query: rootquery,
	// mutation: mutationType,
});
