import { useContext } from "react";

import NewsContext from "../newsContext";
import { NewsContextType } from "../NewsProvider";

const useNewsContext = (): NewsContextType => useContext(NewsContext);

export default useNewsContext;
