import * as yup from "yup";
import { LoginDTOschema } from "../validations/LoginDTO.schema";
export type LoginDTO=yup.InferType<typeof LoginDTOschema>