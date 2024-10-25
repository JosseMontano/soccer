import Modal from "@/modules/core/components/ui/Modal";
import useFetch from "@/modules/core/hooks/useFetch";
import { useState } from "react";
import ClubForm from "../components/ClubForm";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toast";
import { Club } from "../api/responses";

const ClubsPage = () => {
  const { fetchData, postData } = useFetch();
  const [open, setOpen] = useState(false);
  /* Es un estado, son las variaciones de la interfaz */
  const { data, setData } = fetchData("GET /clubs");
  const deleteMutation = postData("DELETE /clubs/:id");
  const [clubSelected, setClubSelected] = useState<Club | null>(null);
  const handleDelete = (id: string) => {
    toastConfirm("Seguro que quieres eliminar el registro del club?", () => {
      deleteMutation(null, {
        params: {
          id,
        },
        onSuccess: (response) => {
          setData((prev) => prev.filter((item) => item.id !== id));
          toastSuccess(response.message);
        },
      });
    });
  };
  return (
    <>
      <div>Clubs</div>
      <button
        onClick={() => {
          setOpen(true);
          setClubSelected(null);
        }}
      >
        Añadir club
      </button>
      {open && (
        <Modal closeModal={() => setOpen(false)} title="Registro de clubes">
          <p>Ingrese todos los datos del club</p>
          <ClubForm
            closeModal={() => setOpen(false)}
            setData={setData}
            club={clubSelected}
          />
        </Modal>
      )}
      <div>
        {data?.map((v) => (
          <div key={v.id}>
            <p>
              {v.name} 
            </p>
            <button onClick={() => handleDelete(v.id)}>
              Eliminar club
            </button>
            <button
              onClick={() => {
                setOpen(true);
                setClubSelected(v);
              }}
            >
              Editar club
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ClubsPage;
