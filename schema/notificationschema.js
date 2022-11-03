const NotificationModel = require("../models/notification");
const utils = require("../common/utils");

const {
	GraphQLID,
	GraphQLString,
	GraphQLList,
	GraphQLType,
	GraphQLSchema,
	GraphQLNonNull,
	GraphQLObjectType,
} = require("graphql");

const NotificationType = new GraphQLObjectType({
	name: "Notification",
	fields: {
		id: { type: GraphQLID },
		status: { type: GraphQLString },
		patientid: { type: GraphQLString },
		adminid: { type: GraphQLString },
		doctorid: { type: GraphQLString },
		message1: { type: GraphQLString },
		message2: { type: GraphQLString },
		message3: { type: GraphQLString },
		message4: { type: GraphQLString },
		kind: { type: GraphQLString },
	},
});

const rootquery = new GraphQLObjectType({
	name: "Query",
	fields: {
		// Query 1

		// name of the query, people
		notification: {
			// the type of response this query will return, here NotificationType
			type: new GraphQLList(NotificationType),
			// resolver is required
			resolve: (root, args, context, info) => {
				// we are returning all persons available in the table in mongodb
				return NotificationModel.find().exec();
			},
		},
		// Query 2
		notificationByID: {
			// name of the query is people by id
			type: NotificationType,
			args: {
				// strong validation for graphqlid, which is mendatory for running this query
				id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: (root, args, context, info) => {
				return NotificationModel.findById(args.id).exec();
			},
		},
		// Query 3
		notificationByAdminid: {
			type: new GraphQLList(NotificationType),
			args: {
				adminid: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				return NotificationModel.find({ adminid: args.adminid }).exec();
			},
		},
		notificationByDoctorid: {
			type: new GraphQLList(NotificationType),
			args: {
				doctorid: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				return NotificationModel.find({ doctorid: args.doctorid }).exec();
			},
		},
		notificationByKindandStatus: {
			type: new GraphQLList(NotificationType),
			args: {
				kind: { type: GraphQLString },
				status: { type: GraphQLString },
				adminid: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				return NotificationModel.find({
					kind: args.kind,
					status: args.status,
					adminid: args.adminid,
				}).exec();
			},
		},
	},
});

const mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		notification: {
			type: NotificationType,
			args: {
				status: { type: GraphQLString },
				patientid: { type: GraphQLString },
				adminid: { type: GraphQLString },
				doctorid: { type: GraphQLString },
				message1: { type: GraphQLString },
				message2: { type: GraphQLString },
				message3: { type: GraphQLString },
				message4: { type: GraphQLString },
				kind: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				var people = new NotificationModel(args);
				return people.save();
			},
		},
		update: {
			type: NotificationType,
			args: {
				id: { type: GraphQLID },
				obj: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				var u = NotificationModel.findById(
					args.id,
					function (err, notification) {
						const obj = JSON.parse(args.obj);
						notification = utils.getNotification(notification, obj);

						notification.save();
						return notification;
					}
				);
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: rootquery,
	mutation: mutation,
});
