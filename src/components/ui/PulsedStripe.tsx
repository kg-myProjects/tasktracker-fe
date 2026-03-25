interface PulseLineProps {
    className?: string;
    color?: string;
    height?: string;
    opacity?: number;
}

export default function PulsedStripe({className = "", color = "bg-cyan-500", height = "2px", opacity = 0.5}: PulseLineProps) {
    return (
        <div className={`relative overflow-hidden ${className}`} style={{height}}>
            <div
                className={`${color} absolute bottom-0 left-[-100%] w-full h-full`}
                style={{
                    animation: "progress-flow 1.5s linear infinite",
                    opacity,
                    background: `linear-gradient(90deg, transparent, #06b6d4, transparent)`
                }}
            />
        </div>
    );
}