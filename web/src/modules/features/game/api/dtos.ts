import * as yup from "yup";
import { GameDTOschema } from "../validations/GameDTO.schema";
export type GameDTO=yup.InferType<typeof GameDTOschema>