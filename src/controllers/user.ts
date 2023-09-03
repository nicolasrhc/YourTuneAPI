import { Application, Request, Response } from "express";
import SPUserModel from "../models/SPUser.model";

export const loadUserEndpoints = (app: Application): void => {

    app.get("/user", async (req: Request, res: Response) => {
        try {
            const usuarios = await new SPUserModel().fetchAllUsers();
            res.status(200).send(usuarios)
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    app.post("/user", async (req: Request, res: Response) => {
        const data = req.body;
        try {
            const usuario = await new SPUserModel().saveUser(data)
            res.status(200).send(usuario)
        } catch (e) {
            return res.status(400).send(e);
        }
    });
}