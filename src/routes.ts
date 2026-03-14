import { Express, Request, Response } from "express";
import WebAuthn from "@webauthn";
import OAuth from "@oauth";
// TODO: Improve interface
import { start } from "@users/register/start";

export function register(app: Express) {
    app.get("/test", (_req: Request, res: Response) => {
        console.log("Test route was accessed")
        res.send("Hello World")
    })

    // OAuth 2.1
    // Setup, then redirect to frontend (no params)
    // TODO: This could be way nicer using SSR or making the login page its own 
    //       service, served from the backend 
    app.get(OAuth.endpoint, [
        OAuth.validate,
        OAuth.session.start, 
        (_req: Request, res: Response) => { res.sendStatus(200) },
    ]);
    
    // WebAuthn
    app.post("/webauthn/register/options", [OAuth.session.link, WebAuthn.register.getOptions])
    app.post("/webauthn/login/options", [OAuth.session.link, WebAuthn.login.getOptions])

    // First-Party User Registration
    // TODO: Use sessions to prevent leaking information about ongoing registrations
    app.post("/user/register/start", [start])
}