import { toast, ExternalToast } from "sonner";
import Icon from "../components/icons/Icon";

interface Options extends ExternalToast {
  title?: string;
}

export const toastSuccess = (message: string, data?: Options) => {
  toast(data?.title || "Éxito", {
    icon: (
      <div className="w-5 h-5 text-emerald-500">
        <Icon type={Icon.Types.CHECK} />
      </div>
    ),
    description: message,
    ...data,
  });
};

export const toastError = (message: string, data?: Options) => {
  toast(data?.title || "Error", {
    icon: (
      <div className="w-5 h-5 text-rose-500">
        <Icon type={Icon.Types.X} />
      </div>
    ),
    description: message,
    ...data,
  });
};

export const toastConfirm = (
  message: string,
  onSuccess: () => void,
  data?: Options
) => {
  toast(data?.title || "¿Estás seguro?", {
    icon: (
      <div className="w-5 h-5 text-amber-500">
        <Icon type={Icon.Types.QUESTION} />
      </div>
    ),
    description: message,
    action: {
      label: "Confirmar",
      onClick: onSuccess,
    },
    ...data,
  });
};