import { verify } from "jsonwebtoken";

const checkAuth = (handler) => {
  return async (req, res) => {
    try {
      const authorization = req.headers.authorization.split(" ")[1];
      if (authorization == "null")
        return res.json({
          success: false,
          message: "Failed to authenticate token.",
        });
      if (authorization != "null") {
        const token = authorization;

        verify(token, process.env.ACCESS_TOKEN_SECRET);

        return handler(req, res);
      }
    } catch (e) {
      console.log(e);
      res.status(401).send();
    }
  };
};

export default checkAuth;
