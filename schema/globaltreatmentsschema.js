const GlobalTreatmentsModel = require("../models/treatments");
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
const treatmenttype = require("../models/treatmenttype");

const GlobalTreatmentsType = new GraphQLObjectType({
	name: "globaltreatments",
	fields: {
		id: { type: GraphQLID },
		treatmenttype: { type: GraphQLString },
		bodyarea: { type: GraphQLString },
		treatmentname: { type: GraphQLString },
		syringemin: { type: GraphQLString },
		syringemax: { type: GraphQLString },
		duration: { type: GraphQLString },
		description: { type: GraphQLString },
		quantitysold: { type: GraphQLString },
		quantityavailable: { type: GraphQLString },
		pricepersyring: { type: GraphQLString },
		sellingprice: { type: GraphQLString },
		advancedsetting: { type: GraphQLString },
		defaultdisclosure: { type: GraphQLString },
		customdisclosure: { type: GraphQLString },
		photo1: { type: GraphQLString },
		photo2: { type: GraphQLString },
		video: { type: GraphQLString },
		assigneddoctors: { type: new GraphQLList(GraphQLString) },
		active: { type: GraphQLString },
		userid: { type: GraphQLString },
		createdate: { type: GraphQLString },
		updatedate: { type: GraphQLString },
	},
});

const rootquery = new GraphQLObjectType({
	name: "Query",
	fields: {
		globaltreatments: {
			// the type of response this query will return, here PersonType
			type: new GraphQLList(GlobalTreatmentsType),
			// resolver is required
			resolve: (root, args, context, info) => {
				// we are returning all persons available in the table in mongodb
				return GlobalTreatmentsModel.find().exec();
			},
		},
		treatmentsByID: {
			// name of the query is people by id
			type: GlobalTreatmentsType,
			args: {
				// strong validation for graphqlid, which is mendatory for running this query
				id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: (root, args, context, info) => {
				return GlobalTreatmentsModel.findById(args.id);
			},
		},
		treatmentsBySearch: {
			// name of the query is people by id
			type: new GraphQLList(GlobalTreatmentsType),
			args: {
				// strong validation for graphqlid, which is mendatory for running this query
				search: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				// console.log(args.search);
				return GlobalTreatmentsModel.find({
					$or: [
						{ treatmentname: { $regex: "^" + args.search, $options: "i" } },
						{ treatmenttype: { $regex: "^" + args.search, $options: "i" } },
						// { userName: { $regex: args.search, $options: "i" } },
					],
					$and: [
					{
						photo1:"",
					}]
					// $group: [
					// 	{
					// 		$group: {
					// 			_id: { treatmentname: "$treatmentname" },
					// 		},
					// 	},
					// ],
				}).exec();
			},
		},
	},
});

const mutationType = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		globaltreatments: {
			type: GlobalTreatmentsType,
			args: {
				id: { type: GraphQLID },
				treatmenttype: { type: GraphQLString },
				bodyarea: { type: GraphQLString },
				treatmentname: { type: GraphQLString },
				syringemin: { type: GraphQLString },
				syringemax: { type: GraphQLString },
				duration: { type: GraphQLString },
				description: { type: GraphQLString },
				quantitysold: { type: GraphQLString },
				quantityavailable: { type: GraphQLString },
				pricepersyring: { type: GraphQLString },
				sellingprice: { type: GraphQLString },
				advancedsetting: { type: GraphQLString },
				defaultdisclosure: { type: GraphQLString },
				customdisclosure: { type: GraphQLString },
				photo1: { type: GraphQLString },
				photo2: { type: GraphQLString },
				video: { type: GraphQLString },
				assigneddoctors: { type: GraphQLString },
				active: { type: GraphQLString },
				userid: { type: GraphQLString },
				createdate: { type: GraphQLString },
				updatedate: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				var globaltreatments = new GlobalTreatmentsModel(args);
				return globaltreatments.save();
			},
		},
		update: {
			type: GlobalTreatmentsType,
			args: {
				id: { type: GraphQLID },
				obj: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				const obj = JSON.parse(args.obj);
				// console.log(obj);
				//user = utils.getUser(user, obj);
				const m = GlobalTreatmentsModel.findOneAndUpdate({ _id: args.id }, obj);
				return m;
			},
		},
		delete: {
			type: GlobalTreatmentsType,
			args: {
				id: { type: GraphQLID },
			},
			resolve(parent, args) {
				// console.log("3", args.id);
				return GlobalTreatmentsModel.findByIdAndDelete(args.id);
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: rootquery,
	mutation: mutationType,
});
