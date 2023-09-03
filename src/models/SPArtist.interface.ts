import { SPTypeEnum } from "../enums/SPType.enum";
import { SPImage } from "./SPImage.interface";

export interface SPArtist {
    id: string;
    type: SPTypeEnum;
    name: string;
    images: SPImage[];
    genres: string[];
    followers: {
        total: number;
    };
}