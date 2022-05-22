import cookie from "cookie";
export default async function handle(req, res) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refreshToken", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    })
  );
  res.redirect("/");
}
