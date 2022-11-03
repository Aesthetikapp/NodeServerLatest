const UserSettingsModel = require("../models/settings");
const utils = require("../common/utils");
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

const general = new GraphQLObjectType({
	name: "general",
	fields: {
		language: { type: GraphQLString },
		country: { type: GraphQLString },
		dateformat: { type: GraphQLString },
		timeformat: { type: GraphQLString },
		timezone: { type: GraphQLString },
		status: { type: GraphQLBoolean },
	},
});

const inputgeneral = new GraphQLInputObjectType({
	name: "inputgeneral",
	fields: {
		language: { type: GraphQLString },
		country: { type: GraphQLString },
		dateformat: { type: GraphQLString },
		timeformat: { type: GraphQLString },
		timezone: { type: GraphQLString },
		status: { type: GraphQLBoolean },
	},
});

const calendar = new GraphQLObjectType({
	name: "calendar",
	fields: {
		sameeveryday: { type: GraphQLBoolean },
		days: { type: GraphQLString },
		addlatefee: { type: GraphQLBoolean },
		latefeesamount: { type: GraphQLString },
		latefeesfrom: { type: GraphQLString },
		weekends: { type: GraphQLBoolean },
		declinedappoinments: { type: GraphQLBoolean },
		shorterappoinments: { type: GraphQLBoolean },
		startsweek: { type: GraphQLString },
		status: { type: GraphQLBoolean },
	},
});

const inputcalendar = new GraphQLInputObjectType({
	name: "inputcalendar",
	fields: {
		sameeveryday: { type: GraphQLBoolean },
		days: { type: GraphQLString },
		addlatefee: { type: GraphQLBoolean },
		latefeesamount: { type: GraphQLString },
		latefeesfrom: { type: GraphQLString },
		weekends: { type: GraphQLBoolean },
		declinedappoinments: { type: GraphQLBoolean },
		shorterappoinments: { type: GraphQLBoolean },
		startsweek: { type: GraphQLString },
		status: { type: GraphQLBoolean },
	},
});

const appointment = new GraphQLObjectType({
	name: "appointment",
	fields: {
		radius: { type: GraphQLString },
		interval: { type: GraphQLString },
		autoacceptbooking: { type: GraphQLBoolean },
		autoacceptconsult: { type: GraphQLBoolean },
		status: { type: GraphQLBoolean },
	},
});

const inputappointment = new GraphQLInputObjectType({
	name: "inputappointment",
	fields: {
		radius: { type: GraphQLString },
		interval: { type: GraphQLString },
		autoacceptbooking: { type: GraphQLBoolean },
		autoacceptconsult: { type: GraphQLBoolean },
		status: { type: GraphQLBoolean },
	},
});

const notification = new GraphQLObjectType({
	name: "notification",
	fields: {
		d_request_approval: { type: GraphQLBoolean },
		d_apt_activity: { type: GraphQLBoolean },
		d_conslt_request: { type: GraphQLBoolean },
		d_new_message: { type: GraphQLBoolean },
		e_request_approval: { type: GraphQLBoolean },
		e_apt_activity: { type: GraphQLBoolean },
		e_conslt_request: { type: GraphQLBoolean },
		e_new_message: { type: GraphQLBoolean },
		status: { type: GraphQLBoolean },
	},
});

const inputnotification = new GraphQLInputObjectType({
	name: "inputnotification",
	fields: {
		d_request_approval: { type: GraphQLBoolean },
		d_apt_activity: { type: GraphQLBoolean },
		d_conslt_request: { type: GraphQLBoolean },
		d_new_message: { type: GraphQLBoolean },
		e_request_approval: { type: GraphQLBoolean },
		e_apt_activity: { type: GraphQLBoolean },
		e_conslt_request: { type: GraphQLBoolean },
		e_new_message: { type: GraphQLBoolean },
		status: { type: GraphQLBoolean },
	},
});

const subscription = new GraphQLObjectType({
	name: "subscription",
	fields: {
		subscription_id: { type: GraphQLString },
		date: { type: GraphQLString },
		enable: { type: GraphQLBoolean },
		status: { type: GraphQLBoolean },
	},
});

const inputsubscription = new GraphQLInputObjectType({
	name: "inputsubscription",
	fields: {
		subscription_id: { type: GraphQLString },
		date: { type: GraphQLString },
		enable: { type: GraphQLBoolean },
		status: { type: GraphQLBoolean },
	},
});

const UserSettings = new GraphQLObjectType({
	name: "settings",
	fields: {
		id: { type: GraphQLID },
		userid: { type: GraphQLString },
		general: { type: new GraphQLList(general) },
		calendar: { type: new GraphQLList(calendar) },
		appointment: { type: new GraphQLList(appointment) },
		notification: { type: new GraphQLList(notification) },
		subscription: { type: new GraphQLList(subscription) },
	},
});

const rootquery = new GraphQLObjectType({
	name: "Query",
	fields: {
		userSettings: {
			// name of the query is people by id
			type: new GraphQLList(UserSettings),
			resolve: (root, args, context, info) => {
				return UserSettingsModel.find().exec();
			},
		},
		userSettingsByUserID: {
			// name of the query is people by id
			type: UserSettings,
			args: {
				// strong validation for graphqlid, which is mendatory for running this query
				userid: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				// console.log(args);
				return UserSettingsModel.findOne({
					userid: args.userid,
				}).exec();
			},
		},
	},
});

const mutationType = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		usersetting: {
			type: UserSettings,
			args: {
				general: { type: inputgeneral },
				calendar: { type: inputcalendar },
				appointment: { type: inputappointment },
				notification: { type: inputnotification },
				subscription: { type: inputsubscription },
				userid: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				var usm = new UserSettingsModel(args);
				return usm.save();
			},
		},
		update: {
			type: UserSettings,
			args: {
				userid: { type: GraphQLString },
				obj: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				var u = UserSettingsModel.findOne({ userid: args.userid }).then(
					(doc) => {
						// console.log(doc["general"][0]["language"]);
						// console.log(args.obj.includes("calendar"));
						// console.log("check", "general" in args.obj);
						if (args.obj.includes("general")) {
							doc["general"][0]["language"] = JSON.parse(args.obj)[
								"general"
							][0]["language"];
							doc["general"][0]["country"] = JSON.parse(args.obj)["general"][0][
								"country"
							];
							doc["general"][0]["dateformat"] = JSON.parse(args.obj)[
								"general"
							][0]["dateformat"];
							doc["general"][0]["timeformat"] = JSON.parse(args.obj)[
								"general"
							][0]["timeformat"];
							doc["general"][0]["timezone"] = JSON.parse(args.obj)[
								"general"
							][0]["timezone"];
							doc["general"][0]["status"] = JSON.parse(args.obj)["general"][0][
								"status"
							];
							return doc;
						} else if (args.obj.includes("calendar")) {
							doc["calendar"][0]["sameeveryday"] = JSON.parse(args.obj)[
								"calendar"
							][0]["sameeveryday"];
							doc["calendar"][0]["days"] = JSON.parse(args.obj)["calendar"][0][
								"days"
							];
							doc["calendar"][0]["addlatefee"] = JSON.parse(args.obj)[
								"calendar"
							][0]["addlatefee"];
							doc["calendar"][0]["latefeesamount"] = JSON.parse(args.obj)[
								"calendar"
							][0]["latefeesamount"];
							doc["calendar"][0]["latefeesfrom"] = JSON.parse(args.obj)[
								"calendar"
							][0]["latefeesfrom"];
							doc["calendar"][0]["weekends"] = JSON.parse(args.obj)[
								"calendar"
							][0]["weekends"];
							doc["calendar"][0]["declinedappoinments"] = JSON.parse(args.obj)[
								"calendar"
							][0]["declinedappoinments"];
							doc["calendar"][0]["shorterappoinments"] = JSON.parse(args.obj)[
								"calendar"
							][0]["shorterappoinments"];
							doc["calendar"][0]["startsweek"] = JSON.parse(args.obj)[
								"calendar"
							][0]["startsweek"];
							doc["calendar"][0]["status"] = JSON.parse(args.obj)[
								"calendar"
							][0]["status"];
							return doc;
						} else if (args.obj.includes("appointment")) {
							doc["appointment"][0]["radius"] = JSON.parse(args.obj)[
								"appointment"
							][0]["radius"];
							doc["appointment"][0]["interval"] = JSON.parse(args.obj)[
								"appointment"
							][0]["interval"];
							doc["appointment"][0]["autoacceptbooking"] = JSON.parse(args.obj)[
								"appointment"
							][0]["autoacceptbooking"];
							doc["appointment"][0]["autoacceptconsult"] = JSON.parse(args.obj)[
								"appointment"
							][0]["autoacceptconsult"];
							doc["appointment"][0]["status"] = JSON.parse(args.obj)[
								"appointment"
							][0]["status"];
							return doc;
						} else if (args.obj.includes("notification")) {
							doc["notification"][0]["d_request_approval"] = JSON.parse(
								args.obj
							)["notification"][0]["d_request_approval"];
							doc["notification"][0]["d_apt_activity"] = JSON.parse(args.obj)[
								"notification"
							][0]["d_apt_activity"];
							doc["notification"][0]["d_conslt_request"] = JSON.parse(args.obj)[
								"notification"
							][0]["d_conslt_request"];
							doc["notification"][0]["d_new_message"] = JSON.parse(args.obj)[
								"notification"
							][0]["d_new_message"];
							doc["notification"][0]["e_request_approval"] = JSON.parse(
								args.obj
							)["notification"][0]["e_request_approval"];
							doc["notification"][0]["e_apt_activity"] = JSON.parse(args.obj)[
								"notification"
							][0]["e_apt_activity"];
							doc["notification"][0]["e_conslt_request"] = JSON.parse(args.obj)[
								"notification"
							][0]["e_conslt_request"];
							doc["notification"][0]["e_new_message"] = JSON.parse(args.obj)[
								"notification"
							][0]["e_new_message"];
							doc["notification"][0]["status"] = JSON.parse(args.obj)[
								"notification"
							][0]["status"];
							return doc;
						}
					}
				);
				u.then((value) => {
					// console.log(value);
					value.save();
				});
				// 	.then((doc) => {
				// 	console.log("mmm ", doc["general"][0]["language"]);
				// 	console.log("input", JSON.parse(args.obj)["general"][0]["language"]);
				// 	doc["general"][0]["language"] = JSON.parse(args.obj)["general"][0][
				// 		"language"
				// 	];

				// });
				// UserSettingsModel.find({ userid: args.userid }, function (err, user) {
				// 	console.log("h", user);
				// 	const obj = JSON.parse(args.obj);
				// 	let user1 = utils.getUserSettings(user, obj);
				// 	//console.log(user);
				// 	console.log("h1", user1);
				// 	if (utils.keyExists("general", obj)) {
				// 		user.markModified("general");
				// 	}
				// 	if (utils.keyExists("calendar", obj)) {
				// 		user.markModified("calendar");
				// 	}
				// 	if (utils.keyExists("appointment", obj)) {
				// 		user.markModified("appointment");
				// 	}
				// 	if (utils.keyExists("notification", obj)) {
				// 		user.markModified("notification");
				// 	}
				// 	console.log(user);
				// 	user.save();

				// 	return user;
				// });
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: rootquery,
	mutation: mutationType,
});
