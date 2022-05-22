import { useState } from "react";
import { prisma } from "../../lib/prisma";
import { Container } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import StudentCard from "../../components/StudentCard";
import styles from "../../styles/StudentCard.module.css";
import usePagination from "../../components/Pagination";
import superjson from "superjson";

import Loader from "../../components/Loader";

export default function Protected({ students }) {
  let [page, setPage] = useState(1);
  const perPage = 10;
  const count = Math.ceil(students.length / perPage);
  const dataP = usePagination(students, perPage);
  const handleChange = (e, p) => {
    setPage(p);
    dataP.jump(p);
  };

  return students ? (
    <div>
      <Container className={styles.container} fixed>
        <h1 className={styles.title}>List of Students</h1>
      </Container>
      {dataP.currentData().map((post) => {
        return (
          <div key={post.id} className={styles.card}>
            <StudentCard name={post} />
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

export async function getServerSideProps(context) {
  const post = await prisma.roll.findUnique({
    where: {
      id: parseInt(context.query.id),
    },
  });
  if (post) {
    const { json } = superjson.serialize(post);

    return {
      props: {
        students: json.present,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}
