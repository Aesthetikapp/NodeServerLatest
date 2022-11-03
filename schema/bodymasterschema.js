const BodyMasterModel = require('../models/bodymaster');
const utils = require('../common/utils');
const { GraphQLDate, GraphQLTime, GraphQLDateTime } = require("graphql-iso-date");
const { GraphQLID, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema, GraphQLNonNull, GraphQLObjectType, GraphQLInputObjectType
} = require("graphql");

const BodyMasterType = new GraphQLObjectType({
	name: "bodymaster",
	fields: {
		id: { type: GraphQLID },
		bodyarea: { type: GraphQLString },
		bodydexcription: { type: GraphQLString },
		path: { type: GraphQLString },	
	}
});

const rootquery = new GraphQLObjectType({
	name: "Query",
	fields: {
		bodymaster: {
			// the type of response this query will return, here PersonType
			type: new GraphQLList(BodyMasterType),
			// resolver is required
			resolve: (root, args, context, info) => {
				// we are returning all persons available in the table in mongodb
				return BodyMasterModel.find().exec();
			}
		}
	}
});

const mutationType = new GraphQLObjectType(
	{
		name: "Mutation",
		fields: {
			bodymaster: {
				type: BodyMasterType,
				args: {
					bodyarea: { type: GraphQLString },
					bodydexcription: { type: GraphQLString },
					path: { type: GraphQLString },
					
				},
				resolve: (root, args, context, info) => {					
					var bodymaster = new BodyMasterModel(args);
					return bodymaster.save();
				}
			}
			
		}

	}
);

module.exports = new GraphQLSchema({
	query: rootquery,
	mutation: mutationType
});
