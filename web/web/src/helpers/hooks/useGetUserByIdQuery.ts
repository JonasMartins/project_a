import { GlobalContext } from "./../../context/globalContext";
import { useGetUserByIdQuery } from "./../../generated/graphql";
import { useContext } from "react";

export const getUserByIdQueryHook = async () => {
    const { userId } = useContext(GlobalContext);
    const response = await useGetUserByIdQuery({
        variables: {
            id: "9e55ba38-5590-40e8-a389-534513b0adcc",
        },
    });
    console.log("res: ", response);
    console.log("id: ", userId);

    return response;
};
