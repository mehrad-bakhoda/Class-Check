import { Provider } from "react-redux";
import { createWrapper } from "next-redux-wrapper";
import store from "../app/store";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { refreshToken } from "../functions/auth";
import { useDispatch } from "react-redux";
import { setAccessToken, setUser } from "../app/features/tokenSlice";
import Loader from "../components/Loader";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      await refreshToken().then((data) => {
        if (data.ok) {
          dispatch(setAccessToken(data.accessToken));
          dispatch(setUser(data.user));
        }
        setLoading(false);
      });
      setInterval(async () => {
        await refreshToken().then((data) => {
          if (data.ok) {
            dispatch(setAccessToken(data.accessToken));
            dispatch(setUser(data.user));
          }
        });
      }, 600000);
    }
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8"></meta>
        <title>Call a Roll</title>
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);
export default wrapper.withRedux(MyApp);
