import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import logger from "../middleware/logger";

export default function Shortener() {
  const [urls, setUrls] = useState([{ longUrl: "", validity: "", shortcode: "" }]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const copy = [...urls];
    copy[index][field] = value;
    setUrls(copy);
  };

  const addRow = () => {
    if (urls.length < 5) setUrls([...urls, { longUrl: "", validity: "", shortcode: "" }]);
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const generateShortcode = () => Math.random().toString(36).substring(2, 8);

  const handleShorten = () => {
    const newResults = urls.map((item) => {
      if (!isValidURL(item.longUrl)) {
        logger("handleShorten", "Invalid URL");
        return { error: "Invalid URL" };
      }

      const code = item.shortcode || generateShortcode();
      const expiry = item.validity ? parseInt(item.validity) : 30;
      const expiryDate = new Date(Date.now() + expiry * 60000);

      const record = {
        shortcode: code,
        longUrl: item.longUrl,
        expiry: expiryDate.toISOString(),
        created: new Date().toISOString(),
        clicks: [],
      };

      localStorage.setItem(code, JSON.stringify(record));

      logger("handleShorten", `Shortened ${item.longUrl} -> ${code}`);

      return {
        short: `http://localhost:3000/${code}`,
        ...record,
      };
    });

    setResults(newResults);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      {urls.map((item, idx) => (
        <Box key={idx} sx={{ mb: 2 }}>
          <TextField fullWidth label="Long URL" value={item.longUrl} onChange={(e) => handleChange(idx, "longUrl", e.target.value)} sx={{ mb: 1 }} />
          <TextField label="Validity (mins)" value={item.validity} onChange={(e) => handleChange(idx, "validity", e.target.value)} sx={{ mr: 2 }} />
          <TextField label="Custom Shortcode" value={item.shortcode} onChange={(e) => handleChange(idx, "shortcode", e.target.value)} />
        </Box>
      ))}
      <Button variant="contained" onClick={addRow}>+ Add Another</Button>
      <Button variant="contained" sx={{ ml: 2 }} onClick={handleShorten}>Shorten</Button>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Shortened URLs:</Typography>
        {results.map((r, i) => (
          <Typography key={i}>{r.short} (Expires: {new Date(r.expiry).toLocaleString()})</Typography>
        ))}
      </Box>
    </Box>
  );
}
