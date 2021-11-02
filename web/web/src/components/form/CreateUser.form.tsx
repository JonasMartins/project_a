import React, { useState, ChangeEvent } from "react";
import {
    FormLabel,
    FormControl,
    Stack,
    Text,
    Input,
    Button,
} from "@chakra-ui/react";
import { generateRandomPassword } from "../../helpers/users/userFunctonHelpers";
interface CreateUserFormProps {
    textColor: string;
}

interface userInfo {
    name: string;
    email: string;
    role_id: string;
    password: string;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ textColor }) => {
    const [userInfo, setUserInfo] = useState<userInfo>({
        name: "",
        email: "",
        role_id: "",
        password: "",
    });

    const [randomPassword, setRandomPassword] = useState("");

    setRandomPassword(generateRandomPassword(8));

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInfo((prevUser) => ({
            ...prevUser,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = () => {
        console.log("result ", JSON.stringify(userInfo));
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
                <FormControl id="name">
                    <FormLabel htmlFor="name">
                        <Text color={textColor}>Name</Text>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            onChange={handleChange}
                            value={userInfo.name}
                            borderRadius="2em"
                            size="sm"
                        ></Input>
                    </FormLabel>
                </FormControl>
                <FormControl id="email">
                    <FormLabel htmlFor="email">
                        <Text color={textColor}>Email</Text>
                        <Input
                            id="email"
                            name="email"
                            type="text"
                            onChange={handleChange}
                            value={userInfo.email}
                            borderRadius="2em"
                            size="sm"
                        ></Input>
                    </FormLabel>
                </FormControl>

                <Button
                    type="submit"
                    variant="cyan-gradient"
                    borderRadius="2em"
                    size="md"
                    flexFlow="row"
                    mt={4}
                >
                    Submit
                </Button>
            </Stack>
        </form>
    );
};

export default CreateUserForm;
