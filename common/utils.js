const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const saltRounds = process.env.SALT_ROUNDS;

function getHashData(input) {
	return bcrypt.hashSync(input, bcrypt.genSaltSync(Number(saltRounds)));
}
function comparePassword(password, hash) {
	return bcrypt.compareSync(password, hash);
}
function keyExists(key, search) {
	if (
		!search ||
		(search.constructor !== Array && search.constructor !== Object)
	) {
		return false;
	}
	for (var i = 0; i < search.length; i++) {
		if (search[i] === key) {
			return true;
		}
	}
	return key in search;
}

function getUser(user, obj) {
	const obj1 = obj;
	const keys = Object.keys(user["_doc"]);

	let u = iterate(user, obj1);
	if (keyExists("business", obj1)) {
		u = iterateBusiness(user["business"][0], obj1["business"][0]);
	}
	if (keyExists("verification", obj1)) {
		u = iterateVerification(user["verification"][0], obj1["verification"][0]);
	}
	return user;
}

function getPatient(patient, obj) {
	const obj1 = obj;
	// const keys = Object.keys(patient["_doc"]);

	let u = iterate(patient, obj1);
	if (keyExists("address", obj1)) {
		u = iteratePatient(patient["address"][0], obj1["address"][0]);
	}
	if (keyExists("address1", obj1)) {
		u = iteratePatient(patient["address1"][0], obj1["address1"][0]);
	}
	if (keyExists("address2", obj1)) {
		u = iteratePatient(patient["address2"][0], obj1["address2"][0]);
	}
	if (keyExists("address3", obj1)) {
		u = iteratePatient(patient["address3"][0], obj1["address3"][0]);
	}
	return patient;
}

function getAppointment(appointment, obj) {
	const obj1 = obj;

	const keys = Object.keys(appointment["_doc"]);

	let u = iterate(appointment, obj1);
	// if (keyExists("address", obj1)) {
	// 	u = iteratePatient(patient["address"][0], obj1["address"][0]);
	// }

	return appointment;
}

function getNotification(notification, obj) {
	const obj1 = obj;
	const keys = Object.keys(notification["_doc"]);

	let u = iterate(notification, obj1);
	// if (keyExists("address", obj1)) {
	// 	u = iteratePatient(patient["address"][0], obj1["address"][0]);
	// }

	return notification;
}

function typeCheck(value) {
	const return_value = Object.prototype.toString.call(value);
	const type = return_value.substring(
		return_value.indexOf(" ") + 1,
		return_value.indexOf("]")
	);

	return type.toLowerCase();
}

function iterate(obj, vobj) {
	let u = obj;
	for (var property in obj) {
		if (
			property.indexOf("_") < 0 &&
			property.indexOf("$") < 0 &&
			property !== "schema" &&
			property !== "discriminators" &&
			property !== "id" &&
			property !== "db" &&
			property !== "collection" &&
			typeof obj[property] !== "function"
			// && comment
			// (typeof obj[property] !== "undefined" ||
			// 	typeof user[property] !== undefined)
		) {
			let tp = typeCheck(obj[property]);
			if (tp === "string" || tp === "boolean" || tp === "date") {
				if (vobj[property]) {
					u[property] = vobj[property];
				} else {
					u[property] = obj[property];
				}
			}
		}
	}
	return u;
}

function iterateBusiness(obj, vobj) {
	let u = obj;
	for (var property in obj) {
		if (
			property.indexOf("_") < 0 &&
			property.indexOf("$") < 0 &&
			property !== "schema" &&
			property !== "discriminators" &&
			property !== "id" &&
			property !== "db" &&
			property !== "collection" &&
			typeof obj[property] !== "function" &&
			typeof obj[property] !== "undefined"
			// ||
			// typeof user[property] !== undefined
		) {
			let tp = typeCheck(obj[property]);
			if (tp === "string" || tp === "boolean" || tp === "date") {
				if (vobj[property]) {
					u[property] = vobj[property];
				} else {
					u[property] = obj[property];
				}
			} else {
				if (vobj[property]) {
					iterateBusiness(obj[property][0], vobj[property][0]);
				} else {
					iterateBusiness(obj[property][0], obj[property][0]);
				}
			}
		}
	}
	return u;
}

function iterateVerification(obj, vobj) {
	let u = obj;
	for (var property in obj) {
		if (
			property.indexOf("_") < 0 &&
			property.indexOf("$") < 0 &&
			property !== "schema" &&
			property !== "discriminators" &&
			property !== "id" &&
			property !== "db" &&
			property !== "collection" &&
			typeof obj[property] !== "function"
			// &&
			// (typeof obj[property] !== "undefined"
			// 	|| typeof user[property] !== undefined)
		) {
			let tp = typeCheck(obj[property]);
			if (tp == "array") {
				if (vobj[property] !== undefined) {
					if (u[property].length == 0) {
						for (k = 0; k <= vobj[property].length - 1; k++)
							u[property].push(vobj[property][k]);
						u = u;
					} else {
						u[property].concat(vobj[property]);
						u = u;
					}
				}
			}
		}
	}
	return u;
}

function iteratePatient(obj, vobj) {
	let u = obj;
	for (var property in obj) {
		if (
			property.indexOf("_") < 0 &&
			property.indexOf("$") < 0 &&
			property !== "schema" &&
			property !== "discriminators" &&
			property !== "id" &&
			property !== "db" &&
			property !== "collection" &&
			typeof obj[property] !== "function"
			// && comment
			// (typeof obj[property] !== "undefined" ||
			// 	typeof patient[property] !== undefined)
		) {
			let tp = typeCheck(obj[property]);
			if (tp === "string" || tp === "boolean" || tp === "date") {
				if (vobj[property]) {
					u[property] = vobj[property];
				} else {
					u[property] = obj[property];
				}
			} else {
				// if (vobj[property]) { comment
				// 	iteratePatient(obj[property][0], vobj[property][0]);
				// } else {
				// 	iteratePatient(obj[property][0], obj[property][0]);
				// }
			}
		}
	}
	return u;
}

module.exports = {
	getHashData,
	iterate,
	getUser,
	getPatient,
	getAppointment,
	getNotification,
	keyExists,
	comparePassword,
};
