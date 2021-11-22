import { createContext } from "react";
import { NewsContextType } from "./NewsProvider";

export type NewsStateType = {
    pokemonName: string;
    pokemonAvatar: string;

    error: string;
    isLoading: boolean;
};

/**
 * The initial state
 */
export const initialState: NewsStateType = {
    pokemonName: "",
    pokemonAvatar: "",

    error: "",
    isLoading: false,
};

/**
 * The context
 */
export const NewsContext = createContext<NewsContextType>({
    state: initialState,
    dispatch: () => undefined,
});

export default NewsContext;
