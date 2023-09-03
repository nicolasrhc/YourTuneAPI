import * as mongoose from "mongoose";
import SPUserModel from "./SPUser.model";

export interface SPCommunityCreate {
    nombre: string;
    descripcion: string;
    generos: string[];
    artistas: string[];
}

export interface SPCommunity {
    nombre: string;
    descripcion: string;
    generos: string[];
    artistas: string[];
    _id: string;
}

const SPCommunitySchema = new mongoose.Schema(
    {
        nombre: {
            type: String
        },
        descripcion: {
            type: String
        },
        num_usuarios: {
            type: Number
        },
        generos: {
            type: Array
        },
        artistas: {
            type: Array
        }
    },
    {
        versionKey: false,
    }
)

class SPCommunityModel {
    communityModel = mongoose.model("comunnities", SPCommunitySchema);

    public async saveCommunity(comunidad: SPCommunityCreate, userId: string) {
        const newCommunity = new this.communityModel({
            ...comunidad,
            num_usuarios: 0,
        });
        const result =  await newCommunity.save();

        await new SPUserModel().addCommunity(result._id.toString(), userId);

        return result
    }

    public async addUserCommunity(_id: string) {
        return await this.communityModel.updateOne({_id}, {$inc: {num_usuarios: 1}});
    }

    public async deleteUserCommunity(_id: string) {
        return await this.communityModel.updateOne({_id}, {$inc: {num_usuarios: -1}});
    }

    public async fetchAllUserCommunities(id_user: string) {
        return await this.communityModel.find({id_user: id_user});
    }

    public async fetchAllCommunities() {
        return await this.communityModel.find();
    }

    public async fetchAllCommunitiesFilter(filtros: {nombre?: string, artista?: string}) {
        const nombre = filtros?.nombre ? filtros.nombre : "";

        const filtrosParsed = filtros.artista ? {
            artistas: {$in: [filtros?.artista]},
            nombre: {$regex: nombre, $options: "i"},
        } : {
            nombre: {$regex: nombre, $options: "i"},
        }
        return await this.communityModel.find(filtrosParsed).sort({num_usuarios: 1});
    }

    public async fetchCommunityById(idComunidad: string): Promise<SPCommunity | undefined | null> {
        return await this.communityModel.findById(idComunidad);
    }

    public async fetchCommunitiesByName(nameComunidad: string) {
        return await this.communityModel.find({nombre: {$regex: nameComunidad}});
    }
}

export default SPCommunityModel;