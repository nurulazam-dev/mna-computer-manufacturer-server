import { ObjectId, type ClientSession } from "mongodb";
import { getCollections } from "../../config/collections.js";
import { objectId, type AnyDoc } from "../shared.js";

export const orderRepository = {
  findAll: () => getCollections().orders.find().sort({ _id: -1 }).toArray(),
  findById: (id: string) => getCollections().orders.findOne({ _id: objectId(id) }),
  findByCustomer: (email: string) => getCollections().orders.find({ customer: email }).sort({ _id: -1 }).toArray(),
  create: (data: AnyDoc) => getCollections().orders.insertOne(data),
  updateById: (id: string, update: AnyDoc) => getCollections().orders.updateOne({ _id: objectId(id) }, update),
  markPaid: (id: ObjectId, transactionId: string, session: ClientSession) =>
    getCollections().orders.updateOne(
      { _id: id, paid: { $ne: true } },
      { $set: { paid: true, transactionId } },
      { session },
    ),
  deleteById: (id: string) => getCollections().orders.deleteOne({ _id: objectId(id) }),
};
