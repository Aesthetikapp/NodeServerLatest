const PatientpaymentModel = require("../models/patientpayment");
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

const PatientpaymentType = new GraphQLObjectType({
	name: "Patientpayment",
	fields: {
		id: { type: GraphQLID },
		appointmentid: { type: GraphQLString },
		date: { type: GraphQLString },
		amount: { type: GraphQLString },
		kind: { type: GraphQLString },
		month: { type: GraphQLString },
		year: { type: GraphQLString },
		tax: { type: GraphQLString },
		refund: { type: GraphQLString },
	},
});

const rootquery = new GraphQLObjectType({
	name: "Query",
	fields: {
		// Query 1

		// name of the query, people
		patientpayment: {
			// the type of response this query will return, here PatientpaymentType
			type: new GraphQLList(PatientpaymentType),
			// resolver is required
			resolve: (root, args, context, info) => {
				// we are returning all persons available in the table in mongodb
				return PatientpaymentModel.find().exec();
			},
		},
		// Query 2
		patientpaymentByID: {
			// name of the query is people by id
			type: PatientpaymentType,
			args: {
				// strong validation for graphqlid, which is mendatory for running this query
				id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: (root, args, context, info) => {
				return PatientpaymentModel.findById(args.id).exec();
			},
		},
		// Query 3
		patientpaymentByAppointmentID: {
			type: new GraphQLList(PatientpaymentType),
			args: {
				appointmentid: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				return PatientpaymentModel.find({
					appointmentid: args.appointmentid,
				}).exec();
			},
		},
	},
});

const mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		patientpayment: {
			type: PatientpaymentType,
			args: {
				id: { type: GraphQLID },
				appointmentid: { type: GraphQLString },
				date: { type: GraphQLString },
				amount: { type: GraphQLString },
				kind: { type: GraphQLString },
				month: { type: GraphQLString },
				year: { type: GraphQLString },
				tax: { type: GraphQLString },
				refund: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				var people = new PatientpaymentModel(args);
				return people.save();
			},
		},
		update: {
			type: PatientpaymentType,
			args: {
				id: { type: GraphQLID },
				obj: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				var u = PatientpaymentModel.findById(
					args.id,
					function (err, patientpayment) {
						const obj = JSON.parse(args.obj);
						patientpayment = utils.getpatientpayment(patientpayment, obj);

						patientpayment.save();
						return patientpayment;
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
