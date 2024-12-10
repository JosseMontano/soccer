import Icon from "@/modules/core/components/icons/Icon";
import Banner from "../components/Banner";
import TournamentTable from "../components/TournamentTable";

const HomePage = () => {
  return (
    <section className="flex flex-col p-10 gap-6">
      <Banner />
      <div className="flex justify-between items-center">
        <strong className="text-3xl font-extrabold">Torneos</strong>
        <p className="opacity-80 flex items-center gap-2 text-sm">
          <div className="h-6 aspect-square">
            <Icon type={Icon.Types.CALENDAR} />
          </div>
          Noviembre 23, 2024
        </p>
      </div>
      <TournamentTable />


    </section>
  );
};

export default HomePage;
