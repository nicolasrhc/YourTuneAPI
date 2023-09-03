import { SPArtist } from "../models/SPArtist.interface";
import { SPPlaylist } from "../models/SPPlaylist.interface";
import { SPTrack } from "../models/SPTrack.interface";

export async function getUserPlaylists(spotifyApi: any, spotifyToken: string | undefined): Promise<SPPlaylist[]> {
    spotifyApi.setAccessToken(spotifyToken);

    const idUser = (await spotifyApi.getMe()).body.id;

    const playlists = (await spotifyApi.getUserPlaylists(idUser)).body.items;

    return playlists;
}

export async function createArtistPlaylist(spotifyApi: any, spotifyToken: string | undefined, idArtista: string): Promise<void> {
    spotifyApi.setAccessToken(spotifyToken);

    const artistData = await spotifyApi.getArtist(idArtista);
    const artist: SPArtist = artistData.body;

    const nombrePlaylist = "Lo mejor de " + artist.name;
    const description = "Una playlist con lo mejor de " + artist.name;

    const playlistId = (await spotifyApi.createPlaylist(nombrePlaylist, { description, public: true })).body.id;

    const cancionesData = await spotifyApi.getArtistTopTracks(idArtista, "ES");
    const canciones: SPTrack[] = cancionesData.body.tracks;

    await spotifyApi.addTracksToPlaylist(playlistId, canciones.map(cancion => {
        return "spotify:track:" + cancion.id;
    }));
}

export async function createPlaylistByOther(spotifyApi: any, spotifyToken: string | undefined, idPlaylist: string, nombrePlaylist: string, idsSeleccion: string[]): Promise<void> {
    spotifyApi.setAccessToken(spotifyToken);

    const numeroCanciones: number = (await spotifyApi.getPlaylistTracks(idPlaylist, {limit: 1})).body.total;

    const nuevasCanciones: string[] = [];

    const indices: number[] = [];
    for (let i = 0; i < numeroCanciones; i = i + 50) {
        indices.push(i);
    }

    const promesas = await Promise.all(indices.map(async (indice) => {
        return await spotifyApi.getPlaylistTracks(idPlaylist, {limit: 50, offset: indice});
    }))
    
    promesas.forEach(promesa => {
        (promesa.body.items as { track: SPTrack}[]).forEach(cancion => {
            if (idsSeleccion.includes(cancion.track.artists[0].id)) {
                nuevasCanciones.push(cancion.track.id);
            }
        });
    })
    
    const playlistId = (await spotifyApi.createPlaylist(nombrePlaylist, { description: 'Creada a partir de otra playlist', public: true })).body.id;

    await spotifyApi.addTracksToPlaylist(playlistId, nuevasCanciones.map(cancion => {
        return "spotify:track:" + cancion;
    }));
}