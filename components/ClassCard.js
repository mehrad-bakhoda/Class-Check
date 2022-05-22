import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import styles from "../styles/ClassCard.module.css";
import { useState } from "react";

export default function ClassCard({ title, code, date, id, number, onGoing }) {
  const [going, setGoing] = useState(onGoing);
  const handleStop = (e) => {
    e.preventDefault();
    fetch("/api/stop", {
      method: "POST",
      body: JSON.stringify({
        id: id,
      }),
    }).then((data) => {
      if (data.status == 404) {
        router.replace("/list");
      } else {
        alert("Stoped successfully");
        setGoing(false);
      }
    });
  };
  const card = (
    <div>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
          <br />
        </Typography>
        <Typography sx={{ mt: 1.3 }} variant="body2">
          <div>Class Code : {code}</div>
        </Typography>

        <div className={styles.subText}>{date}</div>
        <div className={styles.subText}>Number of Students : {number}</div>
      </CardContent>
      <CardActions>
        <Link href={`/class/${id}`}>
          <Button size="small">Student List</Button>
        </Link>
        {going && (
          <Button size="small" style={{ color: "red" }} onClick={handleStop}>
            Stop
          </Button>
        )}
      </CardActions>
    </div>
  );
  return (
    <Box className={styles.cardBox}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}
