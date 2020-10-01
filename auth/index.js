import jwt from 'jsonwebtoken';

export const isAuthorized = (req, res, next) => {
    if (typeof req.headers.authorization !== "undefined") {
        // retrieve the authorization header and parse out the
        // JWT using the split function
        let token = req.headers.authorization.split(" ")[1];
        // Here we validate that the JSON Web Token is valid and has been 
        // created using the same private pass phrase
        jwt.verify(token, "Slytherin", { algorithm: "HS256" }, (err, user) => {
            
            // if there has been an error...
            if (err) {  
                // shut them out!
                res.status(500).json({ error: "Not Authorized" });
                throw new Error("Not Authorized");
            }
            // if the JWT is valid, allow them to hit
            // the intended endpoint
            return next();
        });
    } else {
        // No authorization header exists on the incoming
        // request, return not authorized and throw a new error 
        return res.status(500).json({ error: "Not Authorized" });
    }
}

export const checkCookie = (req, res, next) => {
    if (typeof req.headers.cookie !== "undefined") {
        // retrieve the authorization header and parse out the
        // JWT using the split function
        let rawCookie = req.headers.cookie.split('; ')
        let rawJWT = '';
        rawCookie.forEach(test => {
            if(test.split('=')[0]==='JWT'){
                rawJWT = test.split('=')[1];
            }
        });
        // Here we validate that the JSON Web Token is valid and has been 
        // created using the same private pass phrase
        jwt.verify(rawJWT, "Slytherin", { algorithm: "HS256" }, (err, user) => {
            
            // if there has been an error...
            if (err) {  
                // shut them out!
                return res.status(401).json({ error: "Invalid token" });
            }
            // if the JWT is valid, allow them to hit
            // the intended endpoint
            return next();
        });

    } else {
        // No authorization header exists on the incoming
        // request, return not authorized and throw a new error 
        return res.status(500).json({ error: "Token missing" });
        // throw new Error("Not Authorized");
    }
}