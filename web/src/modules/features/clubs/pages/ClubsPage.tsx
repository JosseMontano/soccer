import { Button } from "@/components/ui/button";
import Modal from "@/modules/core/components/ui/Modal";
import { AdminPermissos } from "@/modules/core/constants/ROLES";
import useFetch from "@/modules/core/hooks/useFetch";
import useUserStore from "@/modules/core/store/userStore";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toast";
import { useState } from "react";
import { Club } from "../api/responses";
import ClubForm from "../components/ClubForm";

const ClubsPage = () => {
  const { fetchData, postData } = useFetch();
  const { data, setData } = fetchData("GET /clubs");
  const deleteMutation = postData("DELETE /clubs/:id");
  const [clubSelected, setClubSelected] = useState<Club | null>(null);
  const [open, setOpen] = useState(false);

  const handleDelete = (id: string) => {
    toastConfirm("¿Seguro que quieres eliminar este club?", () => {
      deleteMutation(null, {
        params: { id },
        onSuccess: (response) => {
          setData((prev) => prev.filter((club) => club.id !== id));
          toastSuccess(response.message);
        },
      });
    });
  };

  const { user } = useUserStore();
  return (
    <div className="flex flex-col p-8 gap-5">
      <Modal
        title="Registro de Clubes"
        open={open}
        onOpenChange={setOpen}
        button={(() => {
          const permissos = AdminPermissos(user);
          if (permissos) {
            return (
              <Button
                onClick={() => {
                  setClubSelected(null);
                  setOpen(true);
                }}
              >
                Añadir Club
              </Button>
            );
          }
          return null;
        })()}
        description="Añadir Club"
      >
        <ClubForm
          closeModal={() => setOpen(false)}
          setData={setData}
          club={clubSelected}
        />
      </Modal>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Lista de Clubs</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.map((club) => (
          <div key={club.id} className="p-4 border rounded">
            <p>{club.name}</p>
            {club.logo && (
              <img src={club.logo} alt={club.name} className="w-20 h-20" />
            )}
            <div className="flex gap-2 mt-2">
              <Button
                onClick={() => {
                  setClubSelected(club);
                  setOpen(true);
                }}
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(club.id)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClubsPage;
