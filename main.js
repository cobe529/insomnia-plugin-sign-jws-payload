const jws = require("jws");

const specialHeaderName = "x-jws-private-key";

module.exports.requestHooks = [
    (context) => {
        let text;
        try {
            if (context.request.hasHeader(specialHeaderName)) {
                const secret = context.request.getHeader(specialHeaderName);
                const payload = JSON.parse(context.request.getBody().text);
                text = jws.sign({
                    header: { alg: "ES256", typ: "JWT" },
                    payload,
                    secret,
                });
            }
        } catch (e) {
            context.app.alert("Error", "Encoding payload to JWS string failed.");
        }
        context.request.removeHeader(specialHeaderName);
        context.request.setHeader("Content-Type", "text/plain");
        context.request.setBody({ mimeType: "text/plain", text });
    },
];
