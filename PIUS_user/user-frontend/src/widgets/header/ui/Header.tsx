import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Button,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

interface Props {
  cartCount: number;
  userName: string;
}

export const Header = ({ cartCount, userName }: Props) => {
  const navigate = useNavigate();

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
            transform: [
              "translateY(5px)",
              "translateX(-50px)"
            ].join(' ')
          }}
        />

        <Box display="flex" alignItems="center" gap={3}>
          <Button color="inherit" onClick={() => navigate("/")}>
            Главная
          </Button>
          <Button color="inherit" onClick={() => navigate("/orders")}>
            Заказы
          </Button>

          <IconButton color="inherit" onClick={() => navigate("/cart")}>
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <Box display="flex" alignItems="center" gap={1}>
            <AccountCircleIcon />
            <span>{userName}</span>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
