const UserModel = require("../models/aeuser");
const AppointmentModel = require("../models/appointment");
// const UserModel = require("../models/aeuser");
// const TreatmentModel = require("../models/treatments");
// const PatientModel = require("../models/patient");
const utils = require("../common/utils");
const {
	GraphQLDate,
	// GraphQLTime,
	// GraphQLDateTime,
} = require("graphql-iso-date");
const {
	GraphQLID,
	GraphQLString,
	GraphQLBoolean,
	GraphQLList,
	GraphQLSchema,
	GraphQLNonNull,
	GraphQLObjectType,
	// GraphQLInputObjectType,
} = require("graphql");
// const treatments = require("../models/treatments");

const AppointmentType = new GraphQLObjectType({
	name: "appointment",
	fields: {
		id: { type: GraphQLID },
		patientid: { type: GraphQLString },
		treatmentid: { type: new GraphQLList(GraphQLString) },
		initialsyringes: { type: GraphQLString },
		finalsyringes: { type: GraphQLString },
		status: { type: GraphQLString },
		videodatetime: { type: GraphQLString },
		videoduration: { type: GraphQLString },
		isautoacceptbooking: { type: GraphQLBoolean },
		isautoacceptconsulting: { type: GraphQLBoolean },
		isnotificationenable: { type: GraphQLBoolean },
		ispaymentdone: { type: GraphQLBoolean },
		rating: { type: GraphQLString },
		comment: { type: GraphQLString },
		videourl: { type: GraphQLString },
		starttime: { type: GraphQLString },
		endtime: { type: GraphQLString },
		duration: { type: GraphQLString },
		history: { type: GraphQLString },
		complete: { type: GraphQLString },
		scanimages: { type: GraphQLString },
		isstarted: { type: GraphQLString },
		iscompleted: { type: GraphQLString },
		startpin: { type: GraphQLString },
		endpin: { type: GraphQLString },
		starttreatmentsyringes: { type: GraphQLString },
		endtreatmentsyringes: { type: GraphQLString },
		startmedicalphotos: { type: GraphQLString },
		endmedicalphotos: { type: GraphQLString },
		isdoctorcheckedin: { type: GraphQLString },
		doctorid: { type: GraphQLString },
		location: { type: GraphQLString },
		snoozetime: { type: GraphQLString },
		additionaltime: { type: GraphQLString },
		createddate: { type: GraphQLDate },
		updateddate: { type: GraphQLDate },
		appointmentdate: { type: GraphQLDate },
	},
});

const rootquery = new GraphQLObjectType({
	name: "Query",
	fields: {
		// Query 1

		// name of the query, people
		appointment: {
			// the type of response this query will return, here PersonType
			type: new GraphQLList(AppointmentType),
			// resolver is required
			resolve: (root, args, context, info) => {
				// we are returning all persons available in the table in mongodb
				return AppointmentModel.find().exec();
			},
		},
		// Query 2
		appointmentByID: {
			// name of the query is people by id
			type: AppointmentType,
			args: {
				// strong validation for graphqlid, which is mendatory for running this query
				id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: (root, args, context, info) => {
				return AppointmentModel.findById(args.id);
			},
		},
		// Query 2
		appointmentByAdmin: {
			// name of the query is people by id
			type: new GraphQLList(AppointmentType),
			args: {
				// strong validation for graphqlid, which is mendatory for running this query
				isadmin: { type: GraphQLBoolean },
			},
			resolve: (root, args, context, info) => {
				// console.log(args.isadmin);
				return AppointmentModel.find({ isadmin: args.isadmin }).exec();
			},
		},
		// Query 3
		appointmentByName: {
			type: new GraphQLList(AppointmentType),
			args: {
				firstName: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				return AppointmentModel.find({ firstName: args.firstName }).exec();
			},
		},
		appointmentsByClinicName: {
			type: new GraphQLList(AppointmentType),
			args: {
				clinicname: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				return AppointmentModel.find({ clinicname: args.clinicname }).exec();
			},
		},
		appointmentByEmail: {
			type: new GraphQLList(AppointmentType),
			args: {
				email: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				return AppointmentModel.find({ email: args.email }).exec();
			},
		},

		comparePassword: {
			type: new GraphQLList(AppointmentType),
			args: {
				pwd: { type: GraphQLString },
				hashpwd: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				let rs = utils.comparePassword(args.pwd, args.hashpwd);
				var appointment = new AppointmentModel();
				appointment.password = rs.toString();
				return [appointment];
			},
		},
	},
});

const mutationType = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		appointment: {
			type: AppointmentType,
			args: {
				patientid: { type: GraphQLString },
				treatmentid: { type: new GraphQLList(GraphQLString) },
				initialsyringes: { type: GraphQLString },
				finalsyringes: { type: GraphQLString },
				videodatetime: { type: GraphQLString },
				videoduration: { type: GraphQLString },
				isautoacceptbooking: { type: GraphQLBoolean },
				isautoacceptconsulting: { type: GraphQLBoolean },
				ispaymentdone: { type: GraphQLBoolean },
				isnotificationenable: { type: GraphQLBoolean },
				rating: { type: GraphQLString },
				comment: { type: GraphQLString },
				videourl: { type: GraphQLString },
				starttime: { type: GraphQLString },
				status: { type: GraphQLString },
				endtime: { type: GraphQLString },
				duration: { type: GraphQLString },
				history: { type: GraphQLString },
				complete: { type: GraphQLString },
				scanimages: { type: GraphQLString },
				isstarted: { type: GraphQLString },
				iscompleted: { type: GraphQLString },
				startpin: { type: GraphQLString },
				endpin: { type: GraphQLString },
				starttreatmentsyringes: { type: GraphQLString },
				endtreatmentsyringes: { type: GraphQLString },
				startmedicalphotos: { type: GraphQLString },
				endmedicalphotos: { type: GraphQLString },
				isdoctorcheckedin: { type: GraphQLString },
				doctorid: { type: GraphQLString },
				location: { type: GraphQLString },
				snoozetime: { type: GraphQLString },
				additionaltime: { type: GraphQLString },
				createddate: { type: GraphQLDate },
				updateddate: { type: GraphQLDate },
				appointmentdate: { type: GraphQLDate },
			},
			resolve: (root, args, context, info) => {
				// args.password = utils.getHashData(args.password);
				var appointment = new AppointmentModel(args);
				return appointment.save();
			},
		},
		update: {
			type: AppointmentType,
			args: {
				id: { type: GraphQLID },
				obj: { type: GraphQLString },
			},
			resolve: (root, args, context, info) => {
				var u = AppointmentModel.findById(args.id, function (err, appointment) {
					const obj = JSON.parse(args.obj);
					appointment = utils.getAppointment(appointment, obj);

					appointment.save();
					return appointment;
				});
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: rootquery,
	mutation: mutationType,
});
