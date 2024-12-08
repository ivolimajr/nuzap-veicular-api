export default async (req, res, next) => {
  if (req.headers["x-api-key"] === process.env.APP_SECRET) return next();
  else return res.status(401).json({ mensagem: "Token invalido" });
};
