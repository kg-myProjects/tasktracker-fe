const stripes = [

    {top: "35%", color: "via-cyan-400", delay: "0.5s"},
    {top: "55%", color: "via-green-700", delay: "1s"},
    {top: "75%", color: "via-blue-500", delay: "1.5s"},

];

const AnimatedStripes = () => {
    return (
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
            {stripes.map((stripe, index) => (
                <div
                    key={index}
                    className={`absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent ${stripe.color} to-transparent animate-flicker`}
                    style={{
                        top: stripe.top,
                        animationDelay: stripe.delay,
                    }}
                />
            ))}
        </div>
    );
};

export default AnimatedStripes;