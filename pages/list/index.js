import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { prisma } from "../../lib/prisma";
import { Container } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import ClassCard from "../../components/ClassCard";
import styles from "../../styles/ClassCard.module.css";
import usePagination from "../../components/Pagination";
import superjson from "superjson";
import { verify } from "jsonwebtoken";
import cookie from "cookie";

import useSWR from "swr";
import checkAuthClient from "../../functions/checkAuthClient";
import axios from "axios";
import Loader from "../../components/Loader";

function Protected({ students }) {
  let [page, setPage] = useState(1);
  const perPage = 10;
  const count = Math.ceil(students.length / perPage);
  const dataP = usePagination(students, perPage);
  const handleChange = (e, p) => {
    setPage(p);
    dataP.jump(p);
  };
  const [secret, setSecret] = useState(null);
  const [isError, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.token.value);

  const fetcher = async () => {
    return await axios.get("/api/protectedRoute", {
      headers: {
        authorization: `Bearer ${token.accessToken}`,
      },
    });
  };

  const { data, error } = useSWR("/api/", fetcher);

  useEffect(() => {
    if (data) setSecret(data.data);
    if (error) setError(error);
    setLoading(false);
  }, [data, error]);

  if (loading) {
    return <Loader />;
  } else {
    if (isError) {
      return <div>NOT AUTHENTICATED</div>;
    } else {
      return students ? (
        <div>
          <Container className={styles.container} fixed>
            <h1 className={styles.title}>List of Classes</h1>
          </Container>
          {dataP.currentData().map((post) => {
            return (
              <div key={post.id} className={styles.card}>
                <ClassCard
                  title={post.title}
                  code={post.code}
                  id={post.id}
                  date={post.createdAt}
                  number={post.present.length}
                  onGoing={post.onGoing}
                />
              </div>
            );
          })}
          <Container className={styles.fixedBottom} fixed>
            <Pagination
              count={count}
              size="large"
              page={page}
              variant="outlined"
              shape="rounded"
              onChange={handleChange}
            />
          </Container>
        </div>
      ) : (
        <Loader />
      );
    }
  }
}

export default checkAuthClient(Protected);
export async function getServerSideProps(context) {
  if (context.req.headers.cookie) {
    const getToken = cookie.parse(context.req.headers.cookie);
    const token = getToken.refreshToken;
    let payload = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
      const user = await prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      });
      if (user) {
        const roll = await prisma.roll.findMany({
          where: {
            user: {
              id: payload.userId,
            },
          },
        });
        const { json } = superjson.serialize(roll);

        return {
          props: {
            students: json,
          },
        };
      }
    } catch (e) {
      return {
        notFound: true,
      };
    }
  }
}
