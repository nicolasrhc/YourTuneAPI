import { SPArtist } from "../models/SPArtist.interface";
import SPDailySongModel from "../models/SPDailySong.model";
import { SPTrack } from "../models/SPTrack.interface";
import SPUserDailyPlaylistModel from "../models/SPUserDailyPlaylist.model";

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is inclusive and the minimum is inclusive
}

export async function getRandomSong(spotifyApi: any, spotifyToken: string | undefined): Promise<SPTrack> {
    spotifyApi.setAccessToken(spotifyToken);

    const artistas: SPArtist[] = (await spotifyApi.getMyTopArtists()).body.items;
    
    const artistaRandomN = getRandomInt(0, artistas.length);
    
    const artistaRandom = artistas[artistaRandomN];
    
    const artistasRelacionados: SPArtist[] = (await spotifyApi.getArtistRelatedArtists(artistaRandom.id)).body.artists;
    
    const artistaRelacionadoRandomN = getRandomInt(0, artistasRelacionados.length);
    
    const artistaRandomRelacionado = artistasRelacionados[artistaRelacionadoRandomN];
    
    const topCanciones: SPTrack[] = (await spotifyApi.getArtistTopTracks(artistaRandomRelacionado.id, "ES")).body.tracks;

    const cancionRandomN = getRandomInt(0, topCanciones.length);

    return topCanciones[cancionRandomN];
}

export async function getDailySongById(spotifyApi: any, spotifyToken: string | undefined, id_cancion: string): Promise<SPTrack> {
    spotifyApi.setAccessToken(spotifyToken);
    
    const cancion: SPTrack = (await spotifyApi.getTrack(id_cancion, "ES")).body;

    return cancion;
}

export async function getMyPlaylist(spotifyApi: any, spotifyToken: string | undefined, idUser: string): Promise<void> {
    spotifyApi.setAccessToken(spotifyToken);
    
    const playlists = (await spotifyApi.getUserPlaylists(idUser)).body;
}

export async function createDailyPlaylist(spotifyApi: any, spotifyToken: string | undefined): Promise<string> {
    spotifyApi.setAccessToken(spotifyToken);
    
    const playlistId = (await spotifyApi.createPlaylist("DailySongs", { description: 'Playlist con tus canciones diarias', public: true })).body.id;
    return playlistId;
}

export async function addTrackToPlaylist(spotifyApi: any, spotifyToken: string | undefined, idPlaylist: string, idTrack: string): Promise<void> {
    spotifyApi.setAccessToken(spotifyToken);
    
    await spotifyApi.addTracksToPlaylist(idPlaylist, [`spotify:track:${idTrack}`]);

}

export async function crearDailySong(spotifyApi: any, spotifyToken: string | undefined): Promise<SPTrack | undefined> {
    spotifyApi.setAccessToken(spotifyToken);
    const idUser = (await spotifyApi.getMe()).body.id;
    const cancionesUsuario = await new SPDailySongModel().fetchAllUserSongs(idUser);
    if (cancionesUsuario.length === 0 || cancionesUsuario.filter(cancion => new Date(cancion.createdAt).toString().slice(0, 15) === new Date().toString().slice(0, 15)).length === 0) {
        let idPlaylist = "";
        if(cancionesUsuario.length === 0) {
            idPlaylist = await createDailyPlaylist(spotifyApi, spotifyToken);
            await new SPUserDailyPlaylistModel().savePlaylist({
                id_user: idUser,
                spotify_id: idPlaylist,
            });
        } else {
            idPlaylist = (await new SPUserDailyPlaylistModel().fetchPlaylistByUserId(idUser))?.spotify_id!;
        }
        
        const cancion = await getRandomSong(spotifyApi, spotifyToken)
        await new SPDailySongModel().saveSong({
            id_user: idUser,
            spotify_id: cancion.id,
        });

        await addTrackToPlaylist(spotifyApi, spotifyToken, idPlaylist, cancion.id)

        return cancion;
    } else {
        const cancionId = cancionesUsuario.filter(cancion => new Date(cancion.createdAt).toString().slice(0, 15) === new Date().toString().slice(0, 15))[0].spotify_id;
        if (cancionId) {
            const cancion = await getDailySongById(spotifyApi, spotifyToken, cancionId);
            return cancion;
        }
    }
}

export async function getAllDailySong(spotifyApi: any, spotifyToken: string | undefined): Promise<SPTrack[] | undefined> {
    spotifyApi.setAccessToken(spotifyToken);

    const idUser = (await spotifyApi.getMe()).body.id;

    const idPlaylist = (await new SPUserDailyPlaylistModel().fetchPlaylistByUserId(idUser))?.spotify_id!;

    const canciones: SPTrack[] = (await spotifyApi.getPlaylistTracks(idPlaylist)).body.items;

    return canciones;
}

export async function userHaveDailySong(spotifyApi: any, spotifyToken: string | undefined): Promise<boolean> {
    spotifyApi.setAccessToken(spotifyToken);

    const idUser = (await spotifyApi.getMe()).body.id;

    const cancionesUsuario = await new SPDailySongModel().fetchAllUserSongs(idUser);

    return cancionesUsuario.some(cancion => new Date(cancion.createdAt).toString().slice(0, 15) === new Date().toString().slice(0, 15));
}

export async function getDailySong(spotifyApi: any, spotifyToken: string | undefined): Promise<SPTrack> {
    spotifyApi.setAccessToken(spotifyToken);

    const idUser = (await spotifyApi.getMe()).body.id;

    const cancionUsuario = await new SPDailySongModel().fetchUserSong(idUser);

    const cancion = (await spotifyApi.getTrack((cancionUsuario as any).spotify_id)).body

    return cancion;
}