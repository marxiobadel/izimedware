import { useEffect } from "react";
import { APPNAME } from "../constant/theme";

export function useDocumentTitle(title) {    
    useEffect(() => {
        document.title = title ? `${title} - ${APPNAME}` : APPNAME; 

        return () => {
            document.title = APPNAME;
        }
    }, [title]);
}
 