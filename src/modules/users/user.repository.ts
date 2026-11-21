import { getCollections } from "../../config/collections.js";
import { objectId, type AnyDoc } from "../shared.js";

export const userRepository = {
  findAll: () => getCollections().users.find().sort({ _id: -1 }).toArray(),

  findByEmail: (email: string) =>
    getCollections().users.findOne(
      { email },
      {
        projection: {
          password: 0,
          passwordHash: 0,
          resetToken: 0,
          resetOtp: 0,
          resetOtpHash: 0,
          refreshToken: 0,
          accessToken: 0,
          tokens: 0,
        },
      },
    ),

  upsertByEmail: (email: string, data: AnyDoc) =>
    getCollections().users.updateOne(
      { email },
      { $set: { ...data, email } },
      { upsert: true },
    ),

  updateProfile: (email: string, data: AnyDoc) =>
    getCollections().users.updateOne({ email }, { $set: data }),

  makeAdmin: (id: string) =>
    getCollections().users.updateOne(
      { _id: objectId(id) },
      { $set: { role: "admin" } },
    ),
};
