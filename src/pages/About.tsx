import {usePageTitle} from "../app/customHooks/usePageTitle.ts";

export default function About() {
    usePageTitle("TrackerApp | About")
    return <div>About Page</div>;
}