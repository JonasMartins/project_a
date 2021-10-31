import { createWriteStream, existsSync, mkdirSync } from "fs";
import { FileUpload } from "graphql-upload";
import { ErrorFieldHandler } from "./../errorFieldHandler";
import { ObjectType, Field } from "type-graphql";
import { genericError } from "./../generalAuxiliaryMethods";

@ObjectType()
export class FileResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];

    @Field(() => String, { nullable: true })
    path?: string;
}

/**
 *
 * @param param0
 * @param path The path that the file will be stored, the method try to create
 * all the necessary directories, must be only the path, without the file's name at the end
 * @param field The field's name that represent the file upload option
 * @param method The method's name the was used to call this method
 * @param callerFile The file's name that called this method, most
 * likely the const __filename, will be passed here
 * @returns true if the file has been successfully uploaded, if not
 * returns the ErrorFieldHandler interface
 */
export const manageUploadFile = async (
    { createReadStream, filename }: FileUpload,
    field: string,
    method: string,
    callerFile: string
): Promise<FileResponse> => {
    let success: boolean = false;
    let path: string = "";

    try {
        path = process.cwd() + `/images/${new Date().getTime()}`;

        if (!existsSync(path)) {
            mkdirSync(path, { recursive: true });
        }

        success = await new Promise(async (resolve, reject) =>
            createReadStream()
                .pipe(createWriteStream(path + "/" + filename))
                .on("finish", () => resolve(true))
                .on("error", () => reject(false))
        );
    } catch (err) {
        return {
            errors: genericError(field, method, callerFile, err.message),
        };
    }

    return { path: path + filename };
};
