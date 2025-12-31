import { useState, useEffect } from "react";

const CACHE_KEY = "event_data_cache_v1";
const CACHE_DURATION = 5 * 60 * 1000;
const SPREADSHEET_ID = "1ReGxPjOiaAI_731HY4NSStOILBBwp2TSyvX_Wat9wek";
const SHEET_NAME = "Sheet1";

const getGoogleDriveImage = (url) => {
  if (!url) return "";
  if (
    url.includes("drive.google.com") ||
    url.includes("googleusercontent.com")
  ) {
    const idMatch =
      url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
  }
  return url;
};

export function useEvents() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          const age = Date.now() - parsed.timestamp;

          if (age < CACHE_DURATION) {
            setData(parsed.data);
            setLoading(false);
            return;
          }
        }

        const response = await fetch(
          `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&_t=${Date.now()}`,
          { cache: "no-store" }
        );

        if (!response.ok) throw new Error("Failed to fetch from Google");

        const text = await response.text();
        const jsonString = text.substring(47).slice(0, -2);
        const json = JSON.parse(jsonString);

        const cols = json.table.cols.map((col) => col.label);
        const formattedData = json.table.rows.map((row) => {
          const item = {};
          row.c.forEach((cell, index) => {
            if (cols[index]) {
              const val = cell ? (cell.f != null ? cell.f : cell.v) : "";
              item[cols[index]] = val !== null ? val : "";
            }
          });

          return {
            ...item,
            id: Number(item.id),
            day: Number(item.day),
            poster: getGoogleDriveImage(item.poster),
            coordinators: [
              { name: item.coord1Name, phone: String(item.coord1Phone) },
              { name: item.coord2Name, phone: String(item.coord2Phone) },
            ].filter((c) => c.name),
          };
        });

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            data: formattedData,
          })
        );

        setData(formattedData);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return { events: data, loading, error };
}
