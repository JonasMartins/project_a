export const getServerPathImage = (path: string): string => {
    // recebe o full path do disco do usuário,
    // ex /Users/jonasmartinssouza/Documents/Dev/project_a/server/images/1635646363774/doge.png
    // split no /, padrao vai ser, /images/pasta_unica/nome_arquivo.
    // pegar essas 3 informações + o endereço do server, que deve estar em um .env
    // imagem acessível: localhost:4001/images/1635646363774/doge.png
    // esse valor retornado será visível ao react

    if (!path) {
        return "localhost:4001/images/default-user-image.png";
    }

    let result = "";
    let arrPath = path.split("/");
    let counter = 0;
    let imageFolderIndex = 0;
    for (; counter < arrPath.length; counter++) {
        if (arrPath[counter] === "images") {
            imageFolderIndex = counter;
            break;
        }
    }

    result = "http://localhost:4001";

    for (counter = imageFolderIndex; counter < arrPath.length; counter++) {
        result += "/" + arrPath[counter];
    }
    return result;
};
