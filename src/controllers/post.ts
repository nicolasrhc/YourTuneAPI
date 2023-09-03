import { Application, Request, Response } from "express";
import SPPostModel, { SPPost } from "../models/SPPost.model";

export interface SPPostChildren {
    id: string;
    comments?: SPPostChildren[];
    content: string;
    user_name: string;
    user_url_image: string;
}

function setPosts (parentId: string, posts: SPPost[]): SPPostChildren[] {
    const postSorted: SPPostChildren[] = [];
    posts.filter(post => post.id_parent_post === parentId).forEach(post => {

        
        const newPost: SPPostChildren = {
            content: post.message,
            id: post._id,
            user_name: post.user_name,
            user_url_image: post.user_image_url,
            comments: setPosts(post._id.toString(), posts),
        };

        postSorted.push(newPost);
    });

    return postSorted;
}

export const loadPostsEndpoints = (app: Application): void => {

    app.get("/post/:idCommunity", async (req: Request, res: Response) => {
        try {
            const posts: SPPost[] = (await new SPPostModel().fetchAllCommunityPosts(req.params.idCommunity)) as unknown as SPPost[];

            const postSorted: SPPostChildren[] = setPosts("-1", posts);

            res.status(200).send(postSorted);
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    app.post("/post", async (req: Request, res: Response) => {
        const data = req.body;
        try {
            const cancion = await new SPPostModel().savePost(data);
            res.status(200).send(cancion);
        } catch (e) {
            return res.status(400).send(e);
        }
    });
}