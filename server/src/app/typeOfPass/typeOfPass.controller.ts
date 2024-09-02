import { PrismaClient } from "@prisma/client";
import fastify, { FastifyInstance } from "fastify";
import { ResponseType } from "../../common/interfaces/response";



const prisma = new PrismaClient();
export const endpoint = "/TypeOfPass"

export function passRouter (router:FastifyInstance){
    
    router.get(endpoint, async (request, reply) =>{
        try {
            const typerOfPass = await prisma.typerOfPass.findMany({               
            });

            const response: ResponseType = {
                message: "Tipo de pase obtenido",
                data: typerOfPass,
                status: 200,
            };
            return reply.status(200).send(response);
        } catch (error) {
            if (error instanceof Error) {
                return reply.status(500).send({ message: "Server error: " + error.message });
            }
        }
    });
}