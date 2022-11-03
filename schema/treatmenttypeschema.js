const TreatmentTypeModel = require('../models/treatmenttype');
const utils = require('../common/utils');
const { GraphQLDate, GraphQLTime, GraphQLDateTime } = require("graphql-iso-date");
const { GraphQLID, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema, GraphQLNonNull, GraphQLObjectType, GraphQLInputObjectType
} = require("graphql");

const TreatmentTypeType = new GraphQLObjectType({
	name: "treatmenttype",
	fields: {
		id: { type: GraphQLID },
		treatmenttype: { type: GraphQLString }		,
        bodyarea: { type: GraphQLString }
	}
});

const rootquery = new GraphQLObjectType({
	name: "Query",
	fields: {
		treatmenttype: {
			// the type of response this query will return, here PersonType
			type: new GraphQLList(TreatmentTypeType),
			// resolver is required
			resolve: (root, args, context, info) => {
				// we are returning all persons available in the table in mongodb
				return TreatmentTypeModel.find().exec();
			}
		}
	}
});

const mutationType = new GraphQLObjectType(
	{
		name: "Mutation",
		fields: {
			treatmenttype: {
				type: TreatmentTypeType,
				args: {
                    treatmenttype: { type: GraphQLString }		,
                    bodyarea: { type: GraphQLString }					
				},
				resolve: (root, args, context, info) => {					
					var treatmenttype = new TreatmentTypeModel(args);
					return treatmenttype.save();
				}
			}
		}

	}
);

module.exports = new GraphQLSchema({
	query: rootquery,
	mutation: mutationType
});
