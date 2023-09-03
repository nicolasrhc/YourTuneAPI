import { formToJSON } from "axios";
import { Application, Request, Response } from "express";
import { SPArtist } from "../models/SPArtist.interface";
import { getAllDailySong, crearDailySong, getDailySongById, userHaveDailySong, getDailySong } from "../functions/daily-song";
import SPDailySongModel from "../models/SPDailySong.model";
import { createArtistPlaylist, createPlaylistByOther, getUserPlaylists } from "../functions/playlist";
import SPCommunityModel, { SPCommunity, SPCommunityCreate } from "../models/SPCommunity.model";
import SPUserModel from "../models/SPUser.model";
var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
    clientId: '7705366dc3964086bc21504f1be0fd2e',
    clientSecret: '63c42784619b42e091f267f59bf7b713',
    redirectUri: 'http://localhost:3000/view'
});

export interface TokenType {
    token: string;
}

/*

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://nicoflash:<password>@cluster0.a8ji3du.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

*/

export const loadApiEndpoints = (app: Application): void => {

    //Detalle de un artista
    app.get("/spotify/artist/:idArtista", async (req: Request, res: Response) => {
        try {
            spotifyApi.setAccessToken(req.headers.authorization);
            const artist = await spotifyApi.getArtist(req.params.idArtista);
            return res.status(200).send(artist);
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    //Para busqueda por nombre
    app.get("/spotify/artistas/:nombre", async (req: Request, res: Response) => {
        try {
            spotifyApi.setAccessToken(req.headers.authorization);
            const artist = await spotifyApi.searchArtists(req.params.nombre);
            return res.status(200).send(artist.body.artists.items);
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    //Informacion del usuario
    app.get("/yo", async (req: Request, res: Response) => {
        try {
            spotifyApi.setAccessToken(req.headers.authorization);
            const response = await spotifyApi.getMe();
            return res.status(200).send(response);
        } catch (e) {
            return res.status(400).send(e);
        }
    });
    
    //Canciones mas escuchadas de un artista
    app.get("/spotify/artist-top-tracks/:idArtist", async (req: Request, res: Response) => {
        try {
            spotifyApi.setAccessToken(req.headers.authorization);
            const response = await spotifyApi.getArtistTopTracks(req.params.idArtist, "ES");
            return res.status(200).send(response);
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    app.get("/spotify/current-user", async (req: Request, res: Response) => {
        try {
            spotifyApi.setAccessToken(req.headers.authorization);
            const response = (await spotifyApi.getMe()).body;
            return res.status(200).send(response);
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    app.get("/spotify/daily-song", async (req: Request, res: Response) => {
        try {
            const cancion = await crearDailySong(spotifyApi, req.headers.authorization);

            return res.status(200).send(cancion)
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    app.get("/spotify/user-top-tracks", async (req: Request, res: Response) => {
        try {
            spotifyApi.setAccessToken(req.headers.authorization);
            const response = await spotifyApi.getMyTopTracks();
            return res.status(200).send(response);
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    app.get("/spotify/user-daily-songs", async (req: Request, res: Response) => {
        try {
            const cancion = await getAllDailySong(spotifyApi, req.headers.authorization);

            return res.status(200).send(cancion);
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    app.get("/spotify/user-daily-song", async (req: Request, res: Response) => {
        try {
            const cancion = await getDailySong(spotifyApi, req.headers.authorization);

            return res.status(200).send(cancion);
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    app.get("/spotify/user-have-daily-song", async (req: Request, res: Response) => {
        try {
            const tieneCancion = await userHaveDailySong(spotifyApi, req.headers.authorization);

            return res.status(200).send(tieneCancion);
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    app.get("/spotify/user-playlists", async (req: Request, res: Response) => {
        try {
            const tieneCancion = await getUserPlaylists(spotifyApi, req.headers.authorization);

            return res.status(200).send(tieneCancion);
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    app.post("/spotify/create-playlist-by-other", async (req: Request, res: Response) => {
        const data = req.body;

        try {
            const cancion = await createPlaylistByOther(spotifyApi, req.headers.authorization, data.id_playlist, data.nombre_playlist, data.ids_seleccion);
            res.status(200).send(cancion)
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    app.get("/spotify/create-artist-playlist/:idArtist", async (req: Request, res: Response) => {
        try {
            const cancion = await createArtistPlaylist(spotifyApi, req.headers.authorization, req.params.idArtist);
            res.status(200).send(cancion)
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    // Crear comunidad
    app.post("/communities", async (req: Request, res: Response) => {
        const data = req.body;
        try {
            const user = (await spotifyApi.getMe()).body;
            const comunidad = await new SPCommunityModel().saveCommunity(data, user.id)
            res.status(200).send(comunidad)
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    //Comunidades del usuario
    app.get("/communities/user", async (req: Request, res: Response) => {
        try {
            spotifyApi.setAccessToken(req.headers.authorization);
            const comunidades: SPCommunity[] = [];
            const user = (await spotifyApi.getMe()).body;
            const idsComunidades = await new SPUserModel().fetchUserCommunitiesById(user.id);
            if (idsComunidades) {
                await Promise.all(idsComunidades?.map(async id => {
                    const comunidad = await new SPCommunityModel().fetchCommunityById(id);
                    if (comunidad) {
                        comunidades.push(comunidad);
                    }
                }));
            }
            res.status(200).send(comunidades);
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    app.get("/add-user-to-community/:idCommunity", async (req: Request, res: Response) => {
        try {
            const user = (await spotifyApi.getMe()).body;
            const cancion = await new SPUserModel().addCommunity(req.params.idCommunity, user.id )
            res.status(200).send(cancion)
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    app.get("/delete-user-to-community/:idCommunity", async (req: Request, res: Response) => {
        try {
            const user = (await spotifyApi.getMe()).body;
            const cancion = await new SPUserModel().deleteCommunity(req.params.idCommunity, user.id )
            res.status(200).send(cancion)
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    app.get("/new-user", async (req: Request, res: Response) => {
        try {
            const user = (await spotifyApi.getMe()).body;
            const cancion = await new SPUserModel().saveUser({
                name: user.name,
                spotify_id: user.id,
            })
            res.status(200).send(cancion)
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    app.get("/userddbb", async (req: Request, res: Response) => {
        try {
            const user = (await spotifyApi.getMe()).body;
            const usuario = await new SPUserModel().fetchUserById(user.id);
            res.status(200).send(usuario)
        } catch (e) {
            return res.status(400).send(e);
        }
    });
};
