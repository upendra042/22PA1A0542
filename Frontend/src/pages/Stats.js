import { Box, Typography, Divider, Link } from "@mui/material";
import { useEffect, useState } from "react";
import logger from "../middleware/logger";

export default function Stats() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const data = [];
    for (const key in localStorage) {
      try {
        const entry = JSON.parse(localStorage.getItem(key));
        if (
          entry &&
          entry.longUrl &&
          entry.created &&
          entry.expiry &&
          Array.isArray(entry.clicks)
        ) {
          data.push({ ...entry, shortcode: key });
        }
      } catch {
        continue;
      }
    }

    logger("StatsPage", `Loaded ${data.length} URL stats`);
    setUrls(data);
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener Statistics
      </Typography>

      {urls.length === 0 ? (
        <Typography>No data found.</Typography>
      ) : (
        urls.map((item, idx) => (
          <Box key={idx} sx={{ mb: 4, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              <Link
                href={`http://localhost:3000/${item.shortcode}`}
                target="_blank"
                rel="noopener"
              >
                {`http://localhost:3000/${item.shortcode}`}
              </Link>
            </Typography>
            <Typography><strong>Original URL:</strong> {item.longUrl}</Typography>
            <Typography><strong>Created At:</strong> {new Date(item.created).toLocaleString()}</Typography>
            <Typography><strong>Expires At:</strong> {new Date(item.expiry).toLocaleString()}</Typography>
            <Typography><strong>Total Clicks:</strong> {item.clicks.length}</Typography>

            <Divider sx={{ my: 1 }} />

            {item.clicks.length > 0 ? (
              item.clicks.map((click, i) => (
                <Box key={i} sx={{ ml: 2, mb: 1 }}>
                  <Typography variant="body2">
                    • {new Date(click.timestamp).toLocaleString()} |
                    Source: {click.source || "direct"} |
                    Location: {click.geo || "Unknown"}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ ml: 2 }}>
                No click data yet.
              </Typography>
            )}
          </Box>
        ))
      )}
    </Box>
  );
}
