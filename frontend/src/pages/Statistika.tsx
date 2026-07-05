import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useLocation } from "react-router-dom";
import { api } from "../utils/api";

const Statistika = () => {
  const location = useLocation();
  const [mesta, setMesta] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const stateData = location.state;

  useEffect(() => {
    if (!stateData) {
      api
          .get("/api/catalog")
          .then((res) => {
            const data = Array.isArray(res.data) ? res.data : res.data.data;
            setMesta(data || []);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Greška pri učitavanju baze:", err);
            setLoading(false);
          });
    } else {
      setLoading(false);
    }
  }, [stateData]);

  let atrakcije = 0;
  let restorani = 0;
  let hoteli = 0;
  let naslov = "";

  if (stateData) {
    atrakcije = stateData.brojAktivnosti || 0;
    restorani = stateData.brojRestorana || 0;
    hoteli = stateData.brojHotela || 0;

    const gradNaziv = stateData.grad || "Pretraga";
    naslov = `Analiza za destinaciju: ${
        gradNaziv.charAt(0).toUpperCase() + gradNaziv.slice(1)
    }`;
  } else {
    atrakcije = mesta.filter(
        (m) => m.tip === "atrakcija" || m.category === "attraction" || m.category === "ATTRACTION"
    ).length;

    restorani = mesta.filter(
        (m) => m.tip === "restoran" || m.category === "restaurant" || m.category === "RESTAURANT"
    ).length;

    hoteli = mesta.filter(
        (m) => m.tip === "hotel" || m.category === "hotel" || m.category === "HOTEL"
    ).length;

    naslov = "Globalna statistika baze podataka";
  }

  const dataForChart = [
    ["Kategorija", "Broj"],
    ["Turističke Aktivnosti", atrakcije],
    ["Restorani i kafići", restorani],
    ["Smeštaj (Hoteli)", hoteli],
  ];

  const options = {
    title: naslov,
    pieHole: 0.4,
    is3D: false,
    colors: ["#34d399", "#fbbf24", "#f87171"],
    legend: { position: "bottom" },
    chartArea: { width: "90%", height: "80%" },
    backgroundColor: "transparent",
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen font-bold text-orange-500">
          Učitavanje analitike...
        </div>
    );
  }

  return (
      <div className="max-w-5xl mx-auto p-4 sm:p-10">
        <div className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-800 uppercase mb-2">
              📊 Vizuelna Analiza
            </h1>
            <p className="text-gray-500 font-medium">{naslov}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-green-50 rounded-2xl border-b-4 border-green-400 text-center">
            <span className="block text-sm font-bold text-green-600 uppercase">
              Aktivnosti
            </span>
              <span className="text-4xl font-black text-green-800">{atrakcije}</span>
            </div>

            <div className="p-6 bg-yellow-50 rounded-2xl border-b-4 border-yellow-400 text-center">
            <span className="block text-sm font-bold text-yellow-600 uppercase">
              Restorani
            </span>
              <span className="text-4xl font-black text-yellow-800">{restorani}</span>
            </div>

            <div className="p-6 bg-red-50 rounded-2xl border-b-4 border-red-400 text-center">
            <span className="block text-sm font-bold text-red-600 uppercase">
              Hoteli
            </span>
              <span className="text-4xl font-black text-red-800">{hoteli}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-3xl p-6 flex justify-center">
            {atrakcije + restorani + hoteli > 0 ? (
                <Chart
                    chartType="PieChart"
                    width="100%"
                    height="450px"
                    data={dataForChart}
                    options={options}
                />
            ) : (
                <div className="py-20 text-center text-gray-400">
                  <p className="text-lg italic">
                    Nema dostupnih podataka za prikaz grafikona.
                  </p>
                </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
              Powered by Google Charts API & TripAdvisor Data
            </p>
          </div>
        </div>
      </div>
  );
};

export default Statistika;