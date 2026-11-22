import { getCollections } from "../../config/collections.js";
import type { AnyDoc } from "../shared.js";

export const reviewRepository = {
  findAll: () => getCollections().reviews.find().sort({ _id: -1 }).toArray(),

  create: (data: AnyDoc) =>
    getCollections().reviews.insertOne({ ...data, createdAt: new Date() }),
};
