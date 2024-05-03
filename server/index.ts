import express from 'express';

export function healthCheck() {
  const app = express();
  const port = 80;

  app.get("/", (req, res) => {
    res.send("Shai-Hulud!");
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
}
