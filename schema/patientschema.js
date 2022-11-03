const PatientModel = require("../models/patient");
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

const address = new GraphQLObjectType({
	name: "address",
	fields: {
		id: { type: GraphQLID },
		line1: { type: GraphQLString },
		line2: { type: GraphQLString },
		towncity: { type: GraphQLString },
		postcode: { type: GraphQLString },
		state: { type: GraphQLString },
		country: { type: GraphQLString },
		location: { type: GraphQLString },
		isactive: { type: GraphQLBoolean },
	},
});

const inputaddress = new GraphQLInputObjectType({
	name: "inputaddress",
	fields: {
		line1: { type: GraphQLString },
		line2: { type: GraphQLString },
		towncity: { type: GraphQLString },
		postcode: { type: GraphQLString },
		state: { type: GraphQLString },
		country: { type: GraphQLString },
		location: { type: GraphQLString },
		isactive: { type: GraphQLBoolean },
	},
});

const PatientType = new GraphQLObjectType({
	name: "patient",
	fields: {
		id: { type: GraphQLID },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		avatar: { type: GraphQLString },
		email: { type: GraphQLString },
		phone: { type: GraphQLString },
		allergies: { type: GraphQLString },
		scannedimages: { type: GraphQLString },
		payment: { type: GraphQLString },
		dob: { type: GraphQLDate },
		gender: { type: GraphQLString },
		password: { type: GraphQLString },
		favourites: { type: GraphQLString },
		address: { type: new GraphQLList(address) },
		address1: { type: new GraphQLList(address) },
		address2: { type: new GraphQLList(address) },
		address3: { type: new GraphQLList(address) },
	},
});

const rootquery = new GraphQLObjectType({
	name: "Query",
	fields: {
		// Query 1

		// name of the query, people
		patient: {
			// the type of response this query will return, here PersonType
			type: new GraphQLList(PatientType),
			// resolver is required
			resolve: (root, args, context, info) => {
				// we are returning all persons available in the table in mongodb
				return PatientModel.find().exec();
			},
		},
		// Query 2
		patientByID: {
			// name of the query is people by id
			type: PatientType,
			args: {
				// strong validation for graphqlid, which is mendatory for running this query
				id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: (root, args, context, info) => {
				return PatientModel.findById(args.id);
			},
		},
		// Query 2
		patientByAdmin: {
			// name of the query is people by id
			type: new GraphQLList(PatientType),
			args: {
				// strong validation for graphqlid, which is mendatory for running this query
				isadmin: { type: GraphQLBoolean },
			},
			resolve: (root, args, context, info) => {
				// console.log(args.isadmin);
				return PatientModel.find({ isadmin: args.isadmin }).exec();
			},
		},
		// Query 3
		patientByName: {
			type: new GraphQLList(PatientType),
			args: {
				firstName: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				return PatientModel.find({ firstName: args.firstName }).exec();
			},
		},
		patientsByClinicName: {
			type: new GraphQLList(PatientType),
			args: {
				clinicname: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				return PatientModel.find({ clinicname: args.clinicname }).exec();
			},
		},
		patientByEmail: {
			type: new GraphQLList(PatientType),
			args: {
				email: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				return PatientModel.find({ email: args.email }).exec();
			},
		},
		comparePassword: {
			type: new GraphQLList(PatientType),
			args: {
				pwd: { type: GraphQLString },
				hashpwd: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				let rs = utils.comparePassword(args.pwd, args.hashpwd);
				var patient = new PatientModel();
				patient.password = rs.toString();
				return [patient];
			},
		},
	},
});

const mutationType = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		patient: {
			type: PatientType,
			args: {
				id: { type: GraphQLID },
				firstName: { type: GraphQLString },
				lastName: { type: GraphQLString },
				avatar: { type: GraphQLString },
				email: { type: GraphQLString },
				phone: { type: GraphQLString },
				allergies: { type: GraphQLString },
				scannedimages: { type: GraphQLString },
				payment: { type: GraphQLString },
				dob: { type: GraphQLDate },
				gender: { type: GraphQLString },
				password: { type: GraphQLString },
				favourites: { type: GraphQLString },
				address: { type: inputaddress },
				address1: { type: inputaddress },
				address2: { type: inputaddress },
				address3: { type: inputaddress },
			},
			resolve: (root, args, context, info) => {
				args.password = utils.getHashData(args.password);
				var patient = new PatientModel(args);
				return patient.save();
			},
		},
		update: {
			type: PatientType,
			args: {
				id: { type: GraphQLID },
				obj: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				PatientModel.findById(args.id, function (err, patient) {
					const obj = JSON.parse(args.obj);
					patient = utils.getPatient(patient, obj);
					// console.log(patient);
					if (utils.keyExists("address", obj)) {
						patient.markModified("address");
						// patient.markModified("location");
					}
					if (utils.keyExists("address1", obj)) {
						patient.markModified("address1");
						// patient.markModified("location");
					}
					if (utils.keyExists("address2", obj)) {
						patient.markModified("address2");
						// patient.markModified("location");
					}
					if (utils.keyExists("address3", obj)) {
						patient.markModified("address3");
						// patient.markModified("location");
					}
					// if (utils.keyExists("verification", obj)) {
					// 	patient.markModified("verification");
					// 	patient.markModified("idv");
					// 	patient.markModified("ml");
					// 	patient.markModified("od");
					// 	patient.markModified("mi");
					// 	patient.markModified("ev");
					// }
					patient.save();
					return patient;
				});
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: rootquery,
	mutation: mutationType,
});
