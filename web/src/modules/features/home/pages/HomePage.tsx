import Icon from "@/modules/core/components/icons/Icon";
import Banner from "../components/Banner";
import TournamentTable from "../components/TournamentTable";
import { useRef, useState } from "react";
import { getTodayUtc } from "@/modules/core/utils/getTodayUtc";

const HomePage = () => {
  const dateRef = useRef(getTodayUtc());
  const [date, setDate] = useState(getTodayUtc());

  const handleSaveDate = () => {
    setDate(dateRef.current);
  };

  return (
    <section className="flex flex-col p-10 gap-6">
      <Banner />
      <div className="flex justify-between items-center">
        <strong className="text-3xl font-extrabold">Torneos</strong>
        <div className="flex flex-col">
          <p className="opacity-80 flex items-center gap-2 text-sm">
            <div className="h-6 aspect-square">
              <Icon type={Icon.Types.CALENDAR} />
            </div>
            {date}
          </p>
          <input
            className="text-black"
            type="date"
            onChange={(e) => (dateRef.current = e.target.value)}
          />
          <button onClick={handleSaveDate}>Filtrar</button>
        </div>
      </div>
      <TournamentTable date={date} />
    </section>
  );
};

export default HomePage;
