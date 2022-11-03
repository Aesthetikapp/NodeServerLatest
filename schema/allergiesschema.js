const AllergiesModel = require("../models/allergies");
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

const Allergies = new GraphQLObjectType({
	name: "allergies",
	fields: {
		id: { type: GraphQLID },
		allergyname: { type: GraphQLString },
		allergyDescription: { type: GraphQLString },
	},
});

const rootquery = new GraphQLObjectType({
	name: "Query",
	fields: {
		allergies: {
			// name of the query is people by id
			type: new GraphQLList(Allergies),
			resolve: (root, args, context, info) => {
				return AllergiesModel.find().exec();
			},
		},
		// AllergiesByUserID: {
		// 	// name of the query is people by id
		// 	type: Allergies,
		// 	args: {
		// 		// strong validation for graphqlid, which is mendatory for running this query
		// 		userid: { type: GraphQLString },
		// 	},
		// 	resolve: (root, args, context, info) => {
		// 		// console.log(args);
		// 		return AllergiesModel.findOne({
		// 			userid: args.userid,
		// 		}).exec();
		// 	},
		// },
	},
});

module.exports = new GraphQLSchema({
	query: rootquery,
	// mutation: mutationType,
});
