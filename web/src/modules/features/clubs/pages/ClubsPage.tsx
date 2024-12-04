import Modal from "@/modules/core/components/ui/Modal";
import useFetch from "@/modules/core/hooks/useFetch";
import { useState } from "react";
import ClubForm from "../components/ClubForm";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toast";
import { Club } from "../api/responses";
import { Button } from "@/components/ui/button";
import { AdminPermissos } from "@/modules/core/constants/ROLES";
import useUserStore, { User } from "@/modules/core/store/userStore";

const ClubsPage = () => {
  const { fetchData, postData } = useFetch();
  const { data, setData } = fetchData("GET /clubs");
  const deleteMutation = postData("DELETE /clubs/:id");
  const [clubSelected, setClubSelected] = useState<Club | null>(null);

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
  const {user} = useUserStore()
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Lista de Clubs</h1>
      </div>

      <Modal
        title="Registro de Clubes"
        button={
          (() => {
            const permissos = AdminPermissos(user);
            if (permissos) {
              return (
                <Button
                  onClick={() => {
                    setClubSelected(null);
                  }}
                >
                    Añadir Club
                </Button>
              );
            }
            return null;
          })()
        }
        description="Añadir Club"
      >
        <ClubForm
          closeModal={() => ({})}
          setData={setData}
          club={clubSelected}
        />
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.map((club) => (
          <div key={club.id} className="p-4 border rounded">
            <p>{club.name}</p>
            {club.logo && (
              <img src={club.logo} alt={club.name} className="w-20 h-20" />
            )}
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleDelete(club.id)}>Eliminar</button>
              <button
                onClick={() => {
                  setClubSelected(club);
                }}
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ClubsPage;
