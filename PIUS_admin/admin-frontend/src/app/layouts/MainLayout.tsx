import { type ReactNode } from "react";
import { Box } from "@mui/material";
import styles from "./MainLayout.module.css";
import { Header } from "../../widgets/header/ui/Header";
import { Footer } from "../../widgets/footer/ui/Footer";

interface Props {
  children: ReactNode;
}

export const MainLayout = ({ children }: Props) => {

  return (
    <Box className={styles.background}>
      <Box className={styles.container}>
        <Header />

        <Box sx={{ flex: 1 }}>{children}</Box>

        <Footer />
      </Box>
    </Box>
  );
};
