interface PulsedStripeProps {
    className?: string;
    color?: string;
    height?: string;
    opacity?: number;
}

export default function PulsedStripe({className = "", color = "#06b6d4", height = "2px", opacity = 0.5}: PulsedStripeProps) {
    return (
        <div className={`relative overflow-hidden ${className}`} style={{height}} aria-hidden="true">
            <div
                className={`absolute bottom-0 left-[-100%] w-full h-full`}
                style={{
                    animation: "progress-flow 1.5s linear infinite",
                    opacity,
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`
                }}
            />
        </div>
    );
}