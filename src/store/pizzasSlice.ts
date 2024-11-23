import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Pizza } from "../types";

interface PizzasState {
  pizzas: Pizza[];
}

const initialState: PizzasState = {
  pizzas: [],
};

export const pizzasSlice = createSlice({
  name: "pizzas",
  initialState,
  reducers: {
    addPizza: (state, action: PayloadAction<Pizza>) => {
      state.pizzas.push(action.payload);
    },
    setPizzas: (state, action: PayloadAction<Pizza[]>) => {
      state.pizzas = action.payload;
    },
  },
});

export const { addPizza, setPizzas } = pizzasSlice.actions;

export default pizzasSlice.reducer;
