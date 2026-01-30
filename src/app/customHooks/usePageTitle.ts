// import {useEffect} from "react";
//
// export const usePageTitle = (title: string, defaulttitle = "TrackerApp") => {
//     useEffect(() => {
//         document.title = title;
//         return () => {
//             document.title = defaulttitle;
//         };
//     }, [title, defaulttitle]);
// };
import {useEffect} from "react";

export const usePageTitle = (title: string) => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = title;
        return () => {
            document.title = prevTitle;
        };
    }, [title]);
};