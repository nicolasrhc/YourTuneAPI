import { SPTypeEnum } from "../enums/SPType.enum";
import { SPImage } from "./SPImage.interface";

export interface SPAlbum {
    album_type: string;
    id: string;
    name: string;
    total_tracks: number;
    uri: string;
    images: SPImage[];
    type: SPTypeEnum;
}