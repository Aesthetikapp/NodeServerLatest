const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRIND_APIKEY);

function getMessage(emailParams) {
	return {
		to: emailParams.toEmail,
		from: {
			email: "hello@aesthetik.app",
			name: "Aesthetik Ltd",
		},
		templateId: process.env.SENDGRIND_GETMESSAGE,
		dynamic_template_data: {
			name: emailParams.name,
			redirecturl: emailParams.redirecturl + "/welcome/" + emailParams.userid,
			imgpath: emailParams.redirecturl + "/images/",
		},
	};
}

function getRequestMessage(emailParams) {
	return {
		to: emailParams.toEmail,
		from: {
			email: "hello@aesthetik.app",
			name: "Aesthetik Ltd",
		},
		templateId: process.env.SENDGRIND_GETREQUESTMESSAGE,
		dynamic_template_data: {
			businessname: emailParams.bname,
			redirecturlvr: emailParams.redirecturlvr + emailParams.userid,
			redirecturlaccept:
				emailParams.redirecturlaccept +
				emailParams.ruserid +
				"/" +
				emailParams.userid,
			name: emailParams.name,
			firstname: emailParams.firstname,
			imgpath: emailParams.redirecturl + "/images/",
		},
	};
}

function getDenyMessage(emailParams) {
	return {
		to: emailParams.toEmail,
		from: {
			email: "hello@aesthetik.app",
			name: "Aesthetik Ltd",
		},
		templateId: process.env.SENDGRIND_GETDENYMESSAGE,
		dynamic_template_data: {
			businessname: emailParams.bname,
			redirecturl: emailParams.redirecturl + "/welcome/" + emailParams.userid,
			name: emailParams.name,
			imgpath: emailParams.redirecturl + "/images/",
		},
	};
}

function getApprovedMessage(emailParams) {
	return {
		to: emailParams.toEmail,
		from: {
			email: "hello@aesthetik.app",
			name: "Aesthetik Ltd",
		},
		templateId: process.env.SENDGRIND_GETAPPROVEDMESSAGE,
		dynamic_template_data: {
			businessname: emailParams.businessname,
			redirecturl: emailParams.redirecturl + emailParams.userid,
			name: emailParams.name,
			imgpath: emailParams.redirecturl + "/images/",
		},
	};
}

function getInvitationMessage(emailParams) {
	return {
		to: emailParams.toEmail,
		from: {
			email: "hello@aesthetik.app",
			name: "Aesthetik Ltd",
		},
		templateId: process.env.SENDGRIND_GETINVITATIONMESSAGE,
		dynamic_template_data: {
			businessname: emailParams.businessname,
			redirecturl: emailParams.redirecturl + emailParams.userid,
			name: emailParams.name,
			username: emailParams.username,
			firstname: emailParams.firstname,
			imgpath: emailParams.redirecturl + "/images/",
		},
	};
}

async function signUpConfirmation(emailParams) {
	try {
		await sendGridMail.send(getMessage(emailParams));
		return {
			message: `Order confirmation email sent successfully for orderNr: ${emailParams.name}`,
		};
	} catch (error) {
		const message = `Error sending order confirmation email or orderNr: ${emailParams.name}`;
		console.error(message);
		console.error(error);
		if (error.response) {
			return error.response;
		}
		return { message };
	}
}

async function sendEmail(emailParams) {
	// console.log(emailParams.type);
	let message = "";
	if (emailParams.type === "deny") {
		message = getDenyMessage(emailParams);
	}
	if (emailParams.type === "accept") {
		message = getApprovedMessage(emailParams);
	}
	if (emailParams.type === "request") {
		message = getRequestMessage(emailParams);
	}
	if (emailParams.type === "invite") {
		message = getInvitationMessage(emailParams);
	}
	try {
		// console.log(message);
		await sendGridMail.send(message);
		return {
			message: `Order confirmation email sent successfully for orderNr: ${emailParams.name}`,
		};
	} catch (error) {
		const message = `Error sending order confirmation email or orderNr: ${emailParams.name}`;
		console.error(message);
		console.error(error);
		if (error.response) {
			return error.response;
		}
		return { message };
	}
}

module.exports = {
	signUpConfirmation,
	sendEmail,
};
