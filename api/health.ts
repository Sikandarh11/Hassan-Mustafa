type VercelReq = {
  method?: string;
};

type VercelRes = {
  status: (code: number) => VercelRes;
  json: (payload: unknown) => void;
};

export default function handler(req: VercelReq, res: VercelRes) {
  res.status(200).json({ status: "ok", message: "API layer is running" });
}
