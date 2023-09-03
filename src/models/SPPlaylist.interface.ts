import { SPImage } from "./SPImage.interface";

export interface SPPlaylist {
    collaborative: boolean;
    description: string;
    images: SPImage[];
    name: string;
    id: string; 
}