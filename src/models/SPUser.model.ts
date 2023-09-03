import * as mongoose from "mongoose";
import SPCommunityModel from "./SPCommunity.model";

export interface SPUserCreate {
    name: string;
    spotify_id: string;
}

const SPUserSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        spotify_id: {
            type: String,
            unique: true,
            sparse: true,
            required: true,
        },
        communities_ids: {
            type: Array,
        }
    },
    {
        versionKey: false,
    }
)

class SPUserModel {
    userModel = mongoose.model("SPUser", SPUserSchema);

    public async saveUser(user: SPUserCreate) {
        const newUser = new this.userModel({
            ...user,
            communities_ids: [],
        });
        return await newUser.save();
    }

    public async fetchAllUsers() {
        return await this.userModel.find();
    }

    public async addCommunity(idComunidad: string, spotify_id: string) {
        await this.userModel.updateOne({ spotify_id }, {$push: {communities_ids: idComunidad}});
        await new SPCommunityModel().addUserCommunity(idComunidad);
    }

    public async deleteCommunity(idComunidad: string, spotify_id: string) {
        await this.userModel.updateOne({ spotify_id }, {$pull: {communities_ids: { $in: [idComunidad]}}});
        await new SPCommunityModel().deleteUserCommunity(idComunidad);
    }

    public async fetchUserById(spotify_id: string) {
        return await this.userModel.findOne({ spotify_id });
    }

    public async fetchUserCommunitiesById(spotify_id: string): Promise<string[] | undefined> {
        return (await this.userModel.findOne({ spotify_id }))?.communities_ids;
    }
}

export default SPUserModel;