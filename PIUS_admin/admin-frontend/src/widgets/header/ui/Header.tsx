import { AppBar, Toolbar, Box } from "@mui/material";

export const Header = () => {

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        background: "linear-gradient(135deg, #6c5ce7, #00b894)",
        borderRadius: 3,
        mb: 4,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: "64px",
          height: "64px",
        }}
      >
        <Box
          component="img"
          src="/mainlogo.png"
          alt="Marketplace"
          sx={{
            height: 170,
            objectFit: "contain",
            cursor: "pointer",
            transform: ["translateY(5px)", "translateX(-50px)"].join(" "),
          }}
        />
        <Box>
            <span>ADMIN</span>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
