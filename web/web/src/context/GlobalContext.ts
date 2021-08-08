import React, { createContext, useReducer } from "react";

type init = {
    loading: Boolean;
};

const initalState: init = {
    loading: false,
};

export const GlobalContext = createContext(initalState);

export const GlobalProvider = ({ children }) => {};
