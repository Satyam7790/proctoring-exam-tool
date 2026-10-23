
const fs = require("fs");

const stream = fs.createReadStream("input.txt", {
    encoding: "utf8",
    highWaterMark: 16
});

stream.on("data", (chunk) => {
    console.log("Chunk received:", chunk);
});

stream.on("end", () => {
    console.log("File reading completed");
});

stream.on("error", (err) => {
    console.error("Error:", err.message);
});
