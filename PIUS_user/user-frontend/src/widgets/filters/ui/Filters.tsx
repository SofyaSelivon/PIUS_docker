import {
  Box,
  TextField,
  MenuItem,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useState } from "react";

interface Props {
  onApply: (filters: any) => void;
}

export const Filters = ({ onApply }: Props) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [available, setAvailable] = useState(false);

  const apply = () => {
    onApply({
      search: search || undefined,
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      available: available || undefined,
    });
  };

  return (
    <Box
      display="flex"
      gap={2}
      flexWrap="wrap"
      mb={4}
      p={3}
      bgcolor="background.paper"
      borderRadius={3}
    >
      <TextField
        label="Поиск"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <TextField
        select
        label="Категория"
        size="small"
        sx={{ minWidth: 150 }}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <MenuItem value="">Все</MenuItem>
        <MenuItem value="electronics">Электроника</MenuItem>
        <MenuItem value="clothing">Одежда</MenuItem>
        <MenuItem value="food">Еда</MenuItem>
        <MenuItem value="home">Товары для дома</MenuItem>
        <MenuItem value="beauty">Уход</MenuItem>
        <MenuItem value="sports">Спорт</MenuItem>
        <MenuItem value="books">Книги</MenuItem>
        <MenuItem value="other">Другое</MenuItem>
      </TextField>

      <TextField
        label="Мин цена"
        size="small"
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />

      <TextField
        label="Макс цена"
        size="small"
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
        }
        label="В наличии"
      />

      <Button
        variant="contained"
        onClick={apply}
        sx={{ alignSelf: "flex-end" }}
      >
        Применить
      </Button>
    </Box>
  );
};
