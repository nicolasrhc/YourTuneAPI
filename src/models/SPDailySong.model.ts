import * as mongoose from "mongoose";

export interface SPDailySongCreate {
    id_user: string;
    spotify_id: string;
}

const SPDailySongSchema = new mongoose.Schema(
    {
        id_user: {
            type: String
        },
        spotify_id: {
            type: String
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
)

class SPDailySongModel {
    songModel = mongoose.model("daily_song", SPDailySongSchema);

    public async saveSong(song: SPDailySongCreate) {
        const newSong = new this.songModel(song);
        return await newSong.save();
    }

    public async fetchAllUserSongs(id_user: string) {
        return await this.songModel.find({id_user: id_user});
    }

    public async fetchUserSong(id_user: string) {
        const canciones = await this.fetchAllUserSongs(id_user);
        return canciones.filter(cancion => new Date(cancion.createdAt).toString().slice(0, 15) === new Date().toString().slice(0, 15))[0];
    }
}

export default SPDailySongModel;