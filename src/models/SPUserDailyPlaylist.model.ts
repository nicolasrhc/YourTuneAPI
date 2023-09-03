import * as mongoose from "mongoose";

const SPUserDailyPlaylistSchema = new mongoose.Schema(
    {
        id_user: {
            type: String,
        },
        spotify_id: {
            type: String,
            unique: true,
            sparse: true,
            required: true,
        }
    },
    {
        versionKey: false,
    }
)

class SPUserDailyPlaylistModel {
    playlistModel = mongoose.model("daily_playlist", SPUserDailyPlaylistSchema);

    public async savePlaylist(playlist: any) {
        const newUser = new this.playlistModel(playlist);
        return await newUser.save();
    }

    public async fetchAllPlaylists() {
        return await this.playlistModel.find();
    }

    public async fetchPlaylistByUserId(id_user: string) {
        return await this.playlistModel.findOne({ id_user });
    }
}

export default SPUserDailyPlaylistModel;