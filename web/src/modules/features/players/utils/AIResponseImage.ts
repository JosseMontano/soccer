import OpenAI from "openai";
import AIRole from "./AIRoleImage.txt?raw";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { fileToBase64 } from "./fileToBase64";
import { toastError } from "@/modules/core/utils/toast";

export enum OpenAIModel {
  GPT_4_o_mini = "gpt-4o-mini",
  GPT_4_o = "gpt-4o",
  GPT_4_1_mini = "gpt-4.1-mini",
  GPT_o_3_mini = "o3-mini",
}

export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export const getAIResponseImage = async (
  file: File,
  responseSchema: z.ZodObject<any>,
  callback: (res: string) => void,
  options?: {
    addedPrompt?: string;
    systemRole?: string;
    model?: OpenAIModel;
    onSuccess?: () => void;
    onError?: () => void;
    onFinally?: () => void;
  }
) => {
  try {
    const gptKey = localStorage.getItem("neurall_gpt_huevo");
    if (!gptKey) {
      throw new NotFoundError("No se ha encontrado la clave de GPT.");
    }
    const openai = new OpenAI({
      apiKey: gptKey,
      dangerouslyAllowBrowser: true,
    });

    const model = options?.model ?? OpenAIModel.GPT_4_o_mini;

    if (model === OpenAIModel.GPT_o_3_mini) {
      throw new NotFoundError(
        "El modelo seleccionado no es compatible con imágenes."
      );
    }

    const fileBase64 = await fileToBase64(file);

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: options?.systemRole ?? AIRole,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: fileBase64,
              },
            },
            {
              type: "text",
              text:
                "Esta es la imagen de mi reporte de sesión con el paciente. " +
                (options?.addedPrompt ?? ""),
            },
          ],
        },
      ],
      response_format: zodResponseFormat(responseSchema, "response-schema"),
      temperature: 0.4,
      max_completion_tokens: 2400,
    });

    const result = response;
    const fullText = result.choices[0]?.message?.content || "";
    callback(fullText);
    options?.onSuccess?.();
  } catch (error) {
    if (error instanceof NotFoundError) {
      const errorMessage = (error as Error).message;
      toastError(errorMessage);
    } else {
      toastError("Error al comunicarse con el servidor");
      console.error(error);
    }
    options?.onError?.();
  } finally {
    options?.onFinally?.();
  }
};
