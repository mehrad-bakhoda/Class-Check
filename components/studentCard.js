import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import styles from "../styles/StudentCard.module.css";

export default function ClassCard({ name }) {
  const card = (
    <div>
      <CardContent>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
      </CardContent>
    </div>
  );
  return (
    <Box className={styles.cardBox}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}
