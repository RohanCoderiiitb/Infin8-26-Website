import { useState, useEffect } from "react";

const CACHE_KEY = "event_data_cache_v2";
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

const parseBoolean = (value) => {
  if (!value) return false;
  const normalized = String(value).toLowerCase().trim();
  return normalized === "yes" || normalized === "true" || normalized === "1";
};

export function useEvents() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { timestamp, data: cachedData } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setData(cachedData);
            setLoading(false);
            return;
          }
        }

        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
        const res = await fetch(url);
        const text = await res.text();
        const jsonText = text.match(
          /google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/
        );
        if (!jsonText) throw new Error("Failed to parse response");

        const json = JSON.parse(jsonText[1]);
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
            isIIITBExclusive: parseBoolean(item["IIITB Exclusive?"]),
            isAllThreeDays: parseBoolean(item["All 3 days?"]),
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
        console.error("Error fetching events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { events: data, loading, error };
}
