import { SPAlbum } from "./SPAlbum.interface";
import { SPArtist } from "./SPArtist.interface";
import { SPImage } from "./SPImage.interface";

export interface SPTrack {
    artists: SPArtist[];
    name: string;
    id: string;
    album: SPAlbum;
    images: SPImage[];
}