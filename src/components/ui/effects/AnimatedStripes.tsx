const stripes = [
    {top: "25%", color: "via-dark-accent/35", delay: "1.2s"},
    {top: "75%", color: "via-dark-accent/25", delay: "1.6s"},
    {top: "90%", color: "via-dark-accent/15", delay: "2s"},
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