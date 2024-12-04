import useFetch from "@/modules/core/hooks/useFetch";
import { useState } from "react";
import PlayerForm from "../components/PlayerForm";
import { toastConfirm, toastSuccess } from "@/modules/core/utils/toast";
import { Player } from "../api/responses";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Modal from "@/modules/core/components/ui/Modal";

const PlayersPage = () => {
  const { fetchData, postData } = useFetch();
  /* Es un estado, son las variaciones de la interfaz */
  const { data, setData } = fetchData("GET /players");
  console.log(data)
  const deleteMutation = postData("DELETE /players/:id");
  const [playerSelected, setPlayerSelected] = useState<Player | null>(null);

  const handleDelete = (id: string) => {
    toastConfirm("Seguro que quieres eliminar el registro del jugador?", () => {
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

  const columns: ColumnDef<Player>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre
          </Button>
        );
      },
    },
    {
      accessorKey: "lastName",
      header: "Apellido",
    },
    {
      accessorKey: "birthdate",
      header: "Fecha de nacimiento",
    },
    {
      accessorKey: "nationality",
      header: "Nacionalidad",
    },
    {
      accessorKey: "age",
      header: "Edad",
    },
    {
      accessorKey: "commet",
      header: "Commet",
    },
    {
      accessorKey: "club.name",
      header: "Club",
    },
    {
      header: "acciones",
      cell: ({ row: { original: player } }) => {
        return (
          <div className="flex gap-2">
            <Modal
              title="Editar Jugadore"
              description="Modifique los datos del jugador"
              button={
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    setPlayerSelected(player);
                  }}
                >
                  Editar
                </Button>
              }
            >
              <PlayerForm
                closeModal={() => {}}
                setData={setData}
                player={playerSelected}
              />
            </Modal>

            <Button
              variant={"destructive"}
              onClick={() => handleDelete(player.id)}
            >
              Eliminar
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <section className="flex-1 flex flex-col overflow-hidden p-6 gap-4">
      <div>Players</div>
      <Modal
        title="Registro de jugadores"
        description="Ingrese todos los datos del jugador"
        button={
          <Button
            onClick={() => {
              setPlayerSelected(null);
            }}
          >
            Añadir jugador
          </Button>
        }
      >
        <PlayerForm
          closeModal={() => {}}
          setData={setData}
          player={playerSelected}
        />
      </Modal>
      <div className="flex-1 overflow-auto flex flex-col">
        {data && <DataTable columns={columns} data={data} />}
      </div>
    </section>
  );
};

export default PlayersPage;
