import { Application, Request, Response } from "express";
import SPDailySongModel from "../models/SPDailySong.model";

export const loadDailySongEndpoints = (app: Application): void => {

    app.get("/daily-song/:idUser", async (req: Request, res: Response) => {
        try {
            const canciones = await new SPDailySongModel().fetchAllUserSongs(req.params.idUser);
            res.status(200).send(canciones)
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    app.post("/daily-song", async (req: Request, res: Response) => {
        const data = req.body;
        try {
            const cancion = await new SPDailySongModel().saveSong(data);
            res.status(200).send(cancion)
        } catch (e) {
            return res.status(400).send(e);
        }
    });
}