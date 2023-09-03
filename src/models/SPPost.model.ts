import * as mongoose from "mongoose";

export interface SPPostCreate {
    id_user: string;
    message: string;
    id_community: string;
    id_parent_post: string;
    user_image_url: string;
    user_name: string
}

export interface SPPost {
    _id: string;
    id_user: string;
    message: string;
    id_community: string;
    id_parent_post: string;
    user_image_url: string;
    user_name: string
}

const SPPostSchema = new mongoose.Schema(
    {
        id_user: {
            type: String
        },
        message: {
            type: String
        },
        id_community: {
            type: String
        },
        id_parent_post: {
            type: String
        },
        user_image_url: {
            type: String
        },
        user_name: {
            type: String
        }
    },
    {
        versionKey: false,
        timestamps: true,
    }
)

class SPPostModel {
    postModel = mongoose.model("post", SPPostSchema);

    public async savePost(post: SPPostCreate) {
        const newPost = new this.postModel(post);
        return await newPost.save();
    }

    public async fetchAllCommunityPosts(id_community: string) {
        return await this.postModel.find({ id_community });
    }
}

export default SPPostModel;