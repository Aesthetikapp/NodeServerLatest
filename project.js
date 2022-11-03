const Express = require("express");
const mongoose = require("mongoose");
const ExpressGraphQL = require("express-graphql").graphqlHTTP;
const personschema = require("./schema/personschema");
const userschema = require("./schema/aeuserschema");
const UserModel = require("./models/aeuser");
const settings = require("./models/settings");
const appointmentschema = require("./schema/appointmentschema");
const patientschema = require("./schema/patientschema");
const settingsschema = require("./schema/settingsschema");
const subscriptionschema = require("./schema/subscriptionschema");
const allergiesschema = require("./schema/allergiesschema");
const notificationschema = require("./schema/notificationschema");
const patientpaymentschema = require("./schema/patientpaymentschema");
const bodymasterschema = require("./schema/bodymasterschema");
const globaltreatmentsschema = require("./schema/globaltreatmentsschema");
const treatmenttypeschema = require("./schema/treatmenttypeschema");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const axios = require("axios");
const dotenv = require("dotenv");
const AWS = require("aws-sdk");
const appointment = require("./models/appointment");
const email = require("./email");
const crypto = require("crypto");
const FormData = require("form-data");
const {
	RtcTokenBuilder,
	RtcRole,
	RtmTokenBuilder,
	RtmRole,
	AccessToken,
} = require("agora-access-token"); // By Naresh
const { ServiceChat, AccessToken2 } = require("./agorachat/AccessToken2.js");
dotenv.config();

var app = Express();
var cors = require("cors");

app.use(cors());
app.use(Express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const nocache = (_, resp, next) => {
	resp.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
	resp.header("Expires", "-1");
	resp.header("Pragma", "no-cache");
	next();
};

const ping = (req, resp) => {
	resp.send({ message: "pong" });
};

const generateRTCToken = (req, resp) => {
	// set response header
	resp.header("Access-Control-Allow-Origin", "*");
	// get channel name
	const channelName = req.params.channel;
	if (!channelName) {
		return resp.status(500).json({ error: "channel is required" });
	}
	// get uid
	let uid = req.params.uid;
	if (!uid || uid === "") {
		return resp.status(500).json({ error: "uid is required" });
	}
	// get role
	let role;
	if (req.params.role === "publisher") {
		role = RtcRole.PUBLISHER;
	} else if (req.params.role === "audience") {
		role = RtcRole.SUBSCRIBER;
	} else {
		return resp.status(500).json({ error: "role is incorrect" });
	}
	// get the expire time
	let expireTime = req.query.expiry;
	if (!expireTime || expireTime === "") {
		expireTime = 3600;
	} else {
		expireTime = parseInt(expireTime, 10);
	}
	// calculate privilege expire time
	const currentTime = Math.floor(Date.now() / 1000);
	const privilegeExpireTime = currentTime + expireTime;
	// build the token
	let token;
	if (req.params.tokentype === "userAccount") {
		token = RtcTokenBuilder.buildTokenWithAccount(
			APP_ID,
			APP_CERTIFICATE,
			channelName,
			uid,
			role,
			privilegeExpireTime
		);
	} else if (req.params.tokentype === "uid") {
		token = RtcTokenBuilder.buildTokenWithUid(
			APP_ID,
			APP_CERTIFICATE,
			channelName,
			uid,
			role,
			privilegeExpireTime
		);
	} else {
		return resp.status(500).json({ error: "token type is invalid" });
	}
	// return the token
	return resp.json({ rtcToken: token });
};

app.options("*", cors());
app.get("/ping", nocache, ping);
app.get("/rtc/:channel/:role/:tokentype/:uid", nocache, generateRTCToken);

AWS.config.update({
	accessKeyId: process.env.ACCESS_KEY,
	secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const myBucket = new AWS.S3({
	params: { Bucket: process.env.S3_BUCKET },
	region: process.env.REGION,
});

mongoose
	.connect(process.env.MONGO_URL, {
		auth: {
			username: process.env.MONGO_USERNAME,
			password: process.env.MONGO_PASSWORD,
		},
	})
	.then(() => console.log("Connected to database..."))
	.catch((err) => console.error(err));

app.use("/person", ExpressGraphQL({ schema: personschema, graphiql: true }));

app.use("/aeuser", ExpressGraphQL({ schema: userschema, graphiql: true }));

app.use("/patient", ExpressGraphQL({ schema: patientschema, graphiql: true }));

app.use(
	"/patientpayment",
	ExpressGraphQL({ schema: patientpaymentschema, graphiql: true })
);

app.use(
	"/notification",
	ExpressGraphQL({ schema: notificationschema, graphiql: true })
);

app.use(
	"/appointment",
	ExpressGraphQL({ schema: appointmentschema, graphiql: true })
);

app.use(
	"/usersettings",
	ExpressGraphQL({ schema: settingsschema, graphiql: true })
);

app.use(
	"/subscription",
	ExpressGraphQL({ schema: subscriptionschema, graphiql: true })
);

app.use(
	"/allergies",
	ExpressGraphQL({ schema: allergiesschema, graphiql: true })
);

app.use(
	"/notification",
	ExpressGraphQL({ schema: notificationschema, graphiql: true })
);

app.use(
	"/bodymaster",
	ExpressGraphQL({ schema: bodymasterschema, graphiql: true })
);

app.use(
	"/treatments",
	ExpressGraphQL({ schema: globaltreatmentsschema, graphiql: true })
);

app.use(
	"/treatmenttype",
	ExpressGraphQL({ schema: treatmenttypeschema, graphiql: true })
);

app.get("/getGoogleApiKey", (req, res) => {
	res.send(process.env.GOOGLEAPIKEY);
});

app.post("/startRecording", (req, res) => {
	const appId = process.env.APP_ID;
	const resId = req.body.resId;
	const token = req.body.token;
	const uid = req.body.uid;
	const doctorId = req.body.doctorId;
	const appointmentId = req.body.appointmentId;
	const cname = req.body.cname;
		
	//console.log("recordiing start", req.body);
	//console.log("recordiing region", live_region);

	var data = JSON.stringify({
		uid: "" + uid,
		cname: "" + cname,
		clientRequest: {
			token: "" + token,
			recordingConfig: {
				maxIdleTime: 30,
				streamTypes: 2,
				//"streamMode": "standard",
				audioProfile: 1,
				channelType: 0,
				videoStreamType: 0,
				transcodingConfig: {
					height: 640,
					width: 360,
					bitrate: 500,
					fps: 15,
					mixedVideoLayout: 1,
					backgroundColor: "#FF0000",
				},
				//"subscribeVideoUids": [uidPatient,uid],
				//"subscribeAudioUids": ["#allstream#"],
				subscribeUidGroup: 0,
			},
			recordingFileConfig: {
				avFileType: ["hls", "mp4"],
			},
			storageConfig: {
				accessKey: process.env.ACCESS_KEY,
				region: 0,
				bucket: process.env.S3_BUCKET,
				secretKey: process.env.SECRET_ACCESS_KEY,
				vendor: 1,
				fileNamePrefix: ["" + doctorId, "" + appointmentId, "video"],
			},
		},
	});

	var config = {
		method: "post",
		url:
			process.env.AGORA_URL +
			appId +
			"/cloud_recording/resourceid/" +
			resId +
			"/mode/mix/start",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + process.env.AGORA_AUTHORIZATION,
		},
		data: data,
	};

	axios(config)
		.then(function (response) {
			// console.log(JSON.stringify(response.data));
			return res.send(JSON.stringify(response.data));
		})
		.catch(function (error) {
			console.log(error);
		});
});

app.post("/endRecording", (req, res) => {
	const appId = process.env.APP_ID;
	const resId = req.body.resId;
	const sid = req.body.sid;
	const uid = req.body.uid;
	const cname = req.body.cname;

	// console.log(req.body.resId);
	var data = JSON.stringify({
		cname: "" + cname,
		uid: "" + uid,
		clientRequest: {},
	});

	var config = {
		method: "post",
		url:
			"http://api.agora.io/v1/apps/" +
			appId +
			"/cloud_recording/resourceid/" +
			resId +
			"/sid/" +
			sid +
			"/mode/mix/stop",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + process.env.AGORA_AUTHORIZATION,
		},
		data: data,
	};

	axios(config)
		.then(function (response) {
			// console.log(JSON.stringify(response.data));
			return res.send(JSON.stringify(response.data));
		})
		.catch(function (error) {
			console.log(error);
		});
});

app.get("/getAgoraAppToken", (req, res) => {
	//Agora chat token generator.
	let at = new AccessToken2(
		APP_ID,
		APP_CERTIFICATE,
		new Date().getTime() / 1000,
		6000
	);
	let sc = new ServiceChat();
	sc.add_privilege(ServiceChat.kPrivilegeApp, 6000);
	at.add_service(sc);
	const appToken = at.build();
	// console.log("-appToken: " + appToken);
	res.send(appToken);
});

function chatAppToken() {
	let at = new AccessToken2(
		APP_ID,
		APP_CERTIFICATE,
		new Date().getTime() / 1000,
		6000
	);
	let sc = new ServiceChat();
	sc.add_privilege(ServiceChat.kPrivilegeApp, 6000);
	at.add_service(sc);
	const appToken = at.build();
	return appToken;
}

app.post("/agoraRegisterUser", (req, res) => {
	const appId = process.env.APP_ID;
	const appName = process.env.AGORA_APPNAME;
	const orgName = process.env.AGORA_ORGNAME;
	const appKey = process.env.AGORA_APPKEY;

	var data = JSON.stringify({
		username: "" + req.body.username,
		password: "" + req.body.password,
		nickname: "" + req.body.nickname,
	});

	var config = {
		method: "post",
		url: process.env.AGORA_CHAT_URL + orgName + "/" + appName + "/users",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + chatAppToken(),
		},
		data: data,
	};

	axios(config)
		.then(function (response) {
			// console.log(JSON.stringify(response.data));
			return res.send(JSON.stringify(response.data));
		})
		.catch(function (error) {
			console.log(error);
		});
});

app.post("/CreateToken", (req, res) => {
	const SUMSUB_APP_TOKEN = process.env.SUMSUB_APPTOKEN;
	const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY;
	const SUMSUB_BASE_URL = process.env.SUMSUB_URL;

	var config = {};
	config.baseURL = SUMSUB_BASE_URL;

	function createSignature(config) {
		var ts = Math.floor(Date.now() / 1000);
		const signature = crypto.createHmac("sha256", SUMSUB_SECRET_KEY);
		signature.update(ts + config.method.toUpperCase() + config.url);

		if (config.data instanceof FormData) {
			signature.update(config.data.getBuffer());
		} else if (config.data) {
			signature.update(config.data);
		}

		config.headers["X-App-Access-Ts"] = ts;
		config.headers["X-App-Access-Sig"] = signature.digest("hex");

		return config;
	}

	function createApplicant(externalUserId, levelName) {
		var method = "post";
		var url = "/resources/applicants?levelName=" + levelName;

		var body = {
			externalUserId: externalUserId,
			email: req.body.email,
			// phone: externalUserId.phone,
		};

		var headers = {
			Accept: "application/json",
			"Content-Type": "application/json",
			"X-App-Token": SUMSUB_APP_TOKEN,
		};

		config.method = method;
		config.url = url;
		config.headers = headers;
		config.data = JSON.stringify(body);

		return config;
	}

	function createAccessToken(
		externalUserId,
		levelName = "basic-kyc-level",
		ttlInSecs = 600
	) {
		var method = "post";
		var url = `/resources/accessTokens?userId=${externalUserId}&ttlInSecs=${ttlInSecs}&levelName=${levelName}`;

		var headers = {
			Accept: "application/json",
			"X-App-Token": SUMSUB_APP_TOKEN,
		};

		config.method = method;
		config.url = url;
		config.headers = headers;
		config.data = null;

		return config;
	}

	var externalUserId =
		"random-JSToken-" + Math.random().toString(36).substr(2, 9);

	async function main(body, doc) {
		axios.interceptors.request.use(createSignature, function (error) {
			return Promise.reject(error);
		});

		var externalUserId = body;
		var levelName = "basic-kyc-level";

		await axios(createApplicant(body, levelName))
			.then(function (response) {
				// console.log("Response:\n", response.data);
				return response;
			})
			.catch(function (error) {
				// console.log("Error:\n", error.response.data);
			});

		await axios(createAccessToken(externalUserId, levelName, 1200))
			.then(function (response) {
				// console.log("Response:\n", response.data);
				return res.send(response.data);
				// return response.data;
			})
			.catch(function (error) {
				// console.log("Error:\n", error.response.data);
			});
		return;
	}

	main(externalUserId, req.files);
});

app.get("/message", (req, res) => {
	axios({
		url: `${process.env.AGORA_CHAT_URL}${process.env.AGORA_ORGNAME}/${process.env.AGORA_APPNAME}/user/6349030a9e53470a0b87df60/user_channels`,

		method: "get",
		headers: {
			Authorization: "Bearer " + chatAppToken(),
		},
	})
		.then((result) => {
			// console.log("res", JSON.stringify(result.data.data.channel_infos));
			res.send(JSON.stringify(result.data.data.channel_infos));
			// return res.data.data;
		})
		.catch((e) => {
			console.log("error", e);
		});
});

app.post("/upload", (req, res) => {
	const totalfile = req.files.file;
	const folder = req.body.user;

	const params = {
		Body: totalfile.data,
		Bucket: process.env.S3_BUCKET,
		Key: folder + totalfile.name,
		ContentType: totalfile.mimetype,
		ACL: "public-read",
	};
	try {
		myBucket
			.putObject(params)
			.on("httpUploadProgress", (evt) => {
				// console.log(Math.round((evt.loaded / evt.total) * 100));
				res.status(200).send({ success: "Upload successful", code: 200 });
			})
			.promise();
	} catch (err) {
		res.status(400).send({ error: err, code: 400 });
	}
});

app.post("/multi", (req, res) => {
	const totalfile1 = req.files.file1;
	const totalfile2 = req.files.file2;
	const totalvideo = req.files.video;
	const folder = req.body.username;
	const videoName = req.body.videoname;

	const params1 = {
		Body: totalfile1.data,
		Bucket: process.env.S3_BUCKET,
		Key: folder + totalfile1.name,
		ContentType: totalfile1.mimetype,
		ACL: "public-read",
	};

	try {
		myBucket
			.putObject(params1)
			.on("httpUploadProgress", (evt) => {
				// console.log(Math.round((evt.loaded / evt.total) * 100));
				// res.status(200).send({ success: "Upload successful", code: 200 });
			})
			.promise();
	} catch (err) {
		res.status(400).send({ error: err, code: 400 });
	}
	if (totalfile2.size > 0) {
		const params2 = {
			Body: totalfile2.data,
			Bucket: process.env.S3_BUCKET,
			Key: folder + totalfile2.name,
			ContentType: totalfile2.mimetype,
			ACL: "public-read",
		};

		try {
			myBucket
				.putObject(params2)
				.on("httpUploadProgress", (evt) => {
					// console.log(Math.round((evt.loaded / evt.total) * 100));
					// res.status(200).send({ success: "Upload successful", code: 200 });
				})
				.promise();
		} catch (err) {
			res.status(400).send({ error: err, code: 400 });
		}
	}
	if (totalvideo !== undefined) {
		const params3 = {
			Body: totalvideo.data,
			Bucket: process.env.S3_BUCKET,
			Key: folder + videoName,
			ContentType: totalvideo.mimetype,
			ACL: "public-read",
		};
		try {
			myBucket
				.putObject(params3)
				.on("httpUploadProgress", (evt) => {
					// console.log(Math.round((evt.loaded / evt.total) * 100));
					// res.status(200).send({ success: "Upload successful", code: 200 });
				})
				.promise();
		} catch (err) {
			res.status(400).send({ error: err, code: 400 });
		}
	}
});

app.get("/getAgoraResourceid/:uid/:cname", (req, res) => {
	var data = JSON.stringify({
		cname: "" + req.params.cname,
		uid: "" + req.params.uid,
		clientRequest: {
			resourceExpiredHour: 24,
			scene: 0,
		},
	});

	var config = {
		method: "post",
		url: `${process.env.AGORA_URL}${process.env.APP_ID}/cloud_recording/acquire`,
		headers: {
			"Content-Type": "application/json",
			Authorization: "Basic " + process.env.AGORA_AUTHORIZATION,
		},
		data: data,
	};

	axios(config)
		.then(function (response) {
			// console.log(JSON.stringify(response.data));
			return res.send(JSON.stringify(response.data));
		})
		.catch(function (error) {
			console.log(error);
		});
});

app.post("/patientfiles", (req, res) => {
	const folder = req.body.name;

	Object.values(req.files).forEach((file) => {
		const params = {
			Body: file.data,
			Bucket: process.env.S3_BUCKET,
			Key: folder + file.name,
			ContentType: file.mimetype,
			ACL: "public-read",
		};
		try {
			myBucket
				.putObject(params)
				.on("httpUploadProgress", (evt) => {
					// console.log(Math.round((evt.loaded / evt.total) * 100));
					// res.status(200).send({ success: "Upload successful", code: 200 });
				})
				.promise();
		} catch (err) {
			res.status(400).send({ error: err, code: 400 });
		}
	});
});

app.get("/getAll/:pid/:did", (req, res) => {
	if (req.params.pid !== "undefined" && req.params.did !== "undefined") {
		appointment.aggregate(
			[
				{
					$match: {
						doctorid: req.params.did,
						patientid: req.params.pid,
					},
				},
				{
					$lookup: {
						from: "user_settings",
						localField: "doctorid",
						foreignField: "userid",
						as: "settings",
					},
				},
				{ $addFields: { doctorid: { $toObjectId: "$doctorid" } } },
				{
					$lookup: {
						from: "aesthetik_users", // collection to join
						localField: "doctorid", //field from the input documents
						foreignField: "_id", //field from the documents of the "from" collection
						as: "doctor_details", // output array field
					},
				},
				{ $addFields: { patientid: { $toObjectId: "$patientid" } } },
				{
					$lookup: {
						from: "patient_users",
						localField: "patientid",
						foreignField: "_id",
						as: "patient_details",
					},
				},
			],
			function (error, data) {
				return res.send(data);
				//console.log(res.json(data));
				//handle error case also
			}
		);
	} else if (req.params.pid !== "undefined") {
		appointment.aggregate(
			[
				{
					$match: {
						patientid: req.params.pid,
					},
				},
				{ $addFields: { doctorid: { $toObjectId: "$doctorid" } } },
				{
					$lookup: {
						from: "aesthetik_users", // collection to join
						localField: "doctorid", //field from the input documents
						foreignField: "_id", //field from the documents of the "from" collection
						as: "doctor_details", // output array field
					},
				},
				{ $addFields: { patientid: { $toObjectId: "$patientid" } } },
				{
					$lookup: {
						from: "patient_users",
						localField: "patientid",
						foreignField: "_id",
						as: "patient_details",
					},
				},
			],
			function (error, data) {
				//console.log(res.json(data));
				//handle error case also
				return res.send(data);
			}
		);
	} else if (req.params.did !== "undefined") {
		appointment.aggregate(
			[
				{
					$match: {
						doctorid: req.params.did,
					},
				},
				{
					$lookup: {
						from: "user_settings",
						localField: "doctorid",
						foreignField: "userid",
						as: "settings",
					},
				},
				{ $addFields: { doctorid: { $toObjectId: "$doctorid" } } },
				{
					$lookup: {
						from: "aesthetik_users", // collection to join
						localField: "doctorid", //field from the input documents
						foreignField: "_id", //field from the documents of the "from" collection
						as: "doctor_details", // output array field
					},
				},
				{ $addFields: { patientid: { $toObjectId: "$patientid" } } },
				{
					$lookup: {
						from: "patient_users",
						localField: "patientid",
						foreignField: "_id",
						as: "patient_details",
					},
				},
			],
			function (error, data) {
				return res.send(data);
				//console.log(res.json(data));
				//handle error case also
			}
		);
	}
});

app.get("/getAssigneddoctors/:id", (req, res) => {
	var doctors = req.params.id.split(",");
	let alldoctors = [];
	var count = 0;
	doctors.forEach(function (id) {
		UserModel.find({ _id: id }, function (error, data) {
			alldoctors.push(data[0]);
		});

		count++;
		if (alldoctors.length === count) {
			return res.json(alldoctors);
		}
	});
});

app.get("/getAssigneddoctorsWithSettings/:id", (req, res) => {
	var doctors = req.params.id.split(",");
	let alldoctors = [];
	var count = 0;
	doctors.forEach(function (id) {
		settings.aggregate(
			[
				{
					$match: {
						userid: id,
					},
				},
				{ $addFields: { userid: { $toObjectId: "$userid" } } },
				{
					$lookup: {
						from: "aesthetik_users", // collection to join
						localField: "userid", //field from the input documents
						foreignField: "_id", //field from the documents of the "from" collection
						as: "doctor_details", // output array field
					},
				},
			],
			function (error, data) {
				alldoctors.push(data);
				count++;
				if (doctors.length === count) {
					return res.json(alldoctors);
				}
			}
		);
	});
});

var whitelist = [
	"http://localhost:3000",
	"http://localhost:8080",
	"http://123.176.43.187:3333",
]; //white list consumers
var corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(null, false);
		}
	},
	methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"X-Requested-With",
		"device-remember-token",
		"Access-Control-Allow-Origin",
		"Origin",
		"Accept",
	],
};
app.use(cors(corsOptions));
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.json({ message: "alive" });
});

app.get("/test", (req, res) => {
	res.json({ message: "test" });
});
app.post("/api/email/signup-confirmation", async (req, res, next) => {
	try {
		res.json(await email.signUpConfirmation(req.body));
	} catch (err) {
		next(err);
	}
});

app.post("/api/email/sendemail", async (req, res, next) => {
	try {
		res.json(await email.sendEmail(req.body));
	} catch (err) {
		next(err);
	}
});

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	console.error(err.message, err.stack);
	res.status(statusCode).json({ message: err.message });

	return;
});

app.listen(process.env.PORT, () => {
	console.log("server running at " + process.env.PORT);
});
