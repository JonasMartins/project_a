import { useReducer, Dispatch, ReactNode } from "react";

import NewsContext, { initialState, NewsStateType } from "./newsContext";

export type NewsActionType =
    | {
          type: "setPokemonName" | "setPokemonAvatar" | "setError";
          payload: string;
      }
    | {
          type: "setIsLoading";
          payload: boolean;
      };

export type NewsContextType = {
    state: NewsStateType;
    dispatch: Dispatch<NewsActionType>;
};

const newsContextReducer = (
    state: NewsStateType,
    action: NewsActionType
): NewsStateType => {
    switch (action.type) {
        case "setPokemonName": {
            console.log(
                `Setting the name of the pokemon to: ${action.payload}`
            );

            return {
                ...state,
                pokemonName: action.payload,
                pokemonAvatar: "",
                error: "",
            };
        }
        case "setPokemonAvatar": {
            console.log(`Updating the avatar for: ${state.pokemonName}`);

            return {
                ...state,
                pokemonAvatar: action.payload,
                error: "",
            };
        }
        case "setError": {
            console.log(`Error: ${action.payload}`);

            return {
                ...state,
                error: action.payload,
            };
        }
        case "setIsLoading": {
            console.log(`Set isLoading: ${action.payload}`);

            return {
                ...state,
                isLoading: action.payload,
            };
        }
        default:
            return state;
    }
};

export const NewsProvider = (props: { children: ReactNode }): JSX.Element => {
    const [state, dispatch] = useReducer(newsContextReducer, initialState);

    return (
        <NewsContext.Provider
            value={{
                state,
                dispatch,
            }}
        >
            {props.children}
        </NewsContext.Provider>
    );
};

export default NewsProvider;
