import { ObjectId } from "mongodb";
import { ApiError } from "../utils/api-error.js";

export type AnyDoc = Record<string, any>;

export function objectId(value: string): ObjectId {
  if (
    !ObjectId.isValid(value) ||
    String(new ObjectId(value)).toLowerCase() !== value.toLowerCase()
  )
    throw new ApiError(400, "Invalid resource id");

  return new ObjectId(value);
}

export function requireEmail(reqEmail?: string): string {
  if (!reqEmail) throw new ApiError(401, "Unauthorized access");
  return reqEmail;
}
