import { getCollections } from "../../config/collections.js";
import { objectId, type AnyDoc } from "../shared.js";

export const productRepository = {
  findAll: () => getCollections().products.find().toArray(),

  findById: (id: string) =>
    getCollections().products.findOne({ _id: objectId(id) }),

  create: (data: AnyDoc) => getCollections().products.insertOne(data),

  deleteById: (id: string) =>
    getCollections().products.deleteOne({ _id: objectId(id) }),
};
