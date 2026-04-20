import { type ReactNode, useEffect, useState } from "react";
import { Box } from "@mui/material";
import styles from "./MainLayout.module.css";
import { Header } from "../../widgets/header/ui/Header";
import { Footer } from "../../widgets/footer/ui/Footer";
import { useGetMeQuery } from "../../entities/user/api/userApi";

interface Props {
  children: ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldFetch(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const { data: user, isLoading, isError } = useGetMeQuery(undefined, {
    skip: !shouldFetch,
  });

  const userName = user?.firstName ?? "";
  const cartCount = user?.cartCount ?? 0;

  return (
    <Box className={styles.background}>
      <Box className={styles.container}>
        <Header cartCount={cartCount} userName={userName} loading={isLoading} />

        <Box sx={{ flex: 1 }}>{children}</Box>

        <Footer />
      </Box>
    </Box>
  );
};
