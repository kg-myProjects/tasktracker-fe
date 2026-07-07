import {usePageTitle} from "../app/customHooks/usePageTitle.ts";

export default function Home() {
    usePageTitle("TrackerApp");
    return (
        <div>
            <h2 className="text-cyan-400 text-2xl font-bold">
                Welcome to the Tracker App!
            </h2>
            <h4 className="text-cyan-400 text-lg">Get started by creating your first task board on the My Boards page.</h4>
        </div>
    );
}