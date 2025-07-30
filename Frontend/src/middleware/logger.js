const logger = (fnName, info = "") => {
  const log = {
    function: fnName,
    message: info,
    timestamp: new Date().toISOString(),
  };
  let logs = JSON.parse(localStorage.getItem("logs") || "[]");
  logs.push(log);
  localStorage.setItem("logs", JSON.stringify(logs));
};

export default logger;
