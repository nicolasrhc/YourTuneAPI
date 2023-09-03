import { Application, Request, Response } from "express";
import SPCommunityModel from "../models/SPCommunity.model";

export const loadCommunitiesEndpoints = (app: Application): void => {

    // Detalle de comunidad por id
    app.get("/communities/:idCommunity", async (req: Request, res: Response) => {
        try {
            const canciones = await new SPCommunityModel().fetchCommunityById(req.params.idCommunity);
            res.status(200).send(canciones)
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    // Todas las comunidades
    app.get("/communities", async (req: Request, res: Response) => {
        try {
            const canciones = await new SPCommunityModel().fetchAllCommunities();
            res.status(200).send(canciones)
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    // Todas las comunidades filtradas
    app.post("/communities/filter", async (req: Request, res: Response) => {
        const data = req.body;
        try {
            const canciones = await new SPCommunityModel().fetchAllCommunitiesFilter(data);
            res.status(200).send(canciones)
        } catch (e) {
            return res.status(400).send(e);
        }
    });
}