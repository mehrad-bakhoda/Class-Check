import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const withAuth = (Component) => {
  const Auth = (props) => {
    const token = useSelector((state) => state.token.value);

    const router = useRouter();
    if (token.accessToken !== null) {
      return <Component {...props} />;
    } else {
      router.replace("/login");
      return null;
    }
  };
  return Auth;
};

export default withAuth;
