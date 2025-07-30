import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logger from "../middleware/logger";

export default function Redirector() {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const record = JSON.parse(localStorage.getItem(shortcode));
    if (!record) {
      logger("Redirector", "Invalid shortcode");
      alert("Invalid link");
      navigate("/");
      return;
    }

    const now = new Date();
    const expiry = new Date(record.expiry);

    if (now > expiry) {
      logger("Redirector", "Expired shortcode");
      alert("Link expired");
      navigate("/");
      return;
    }

    const updatedClicks = record.clicks || [];
    updatedClicks.push({
      timestamp: new Date().toISOString(),
      source: document.referrer,
      geo: "IN", // Placeholder — mock location
    });

    record.clicks = updatedClicks;
    localStorage.setItem(shortcode, JSON.stringify(record));

    logger("Redirector", `Redirected to ${record.longUrl}`);
    window.location.href = record.longUrl;
  }, [shortcode, navigate]);

  return null;
}
