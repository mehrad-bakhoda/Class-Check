import checkAuth from "./middleware/checkAuthServer";

const protectedRoute = async (req, res) => {
  if (req.method === "GET") {
    res.send("Hey, keep it in secret!");
  }
};

export default checkAuth(protectedRoute);
