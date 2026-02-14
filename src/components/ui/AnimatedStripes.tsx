const AnimatedStripes = () => {
    return (
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-[35%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent
                     via-cyan-400 to-transparent animate-flicker"
                 style={{animationDelay: "0.5s"}}>
            </div>

            <div className="absolute top-[55%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent
                     via-green-700 to-transparent animate-flicker"
                 style={{animationDelay: "1s"}}>
            </div>

            <div className="absolute top-[75%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent
                     via-blue-500 to-transparent animate-flicker"
                 style={{animationDelay: "1.5s"}}>
            </div>
        </div>
    );
};

export default AnimatedStripes;