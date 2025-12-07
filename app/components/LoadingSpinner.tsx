interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: 'emerald' | 'orange' | 'white';
    className?: string;
}

export default function LoadingSpinner({
    size = 'medium',
    color = 'emerald',
    className = '',
}: LoadingSpinnerProps) {
    const sizeClasses = {
        small: 'w-5 h-5',
        medium: 'w-8 h-8',
        large: 'w-12 h-12',
    };

    const colorClasses = {
        emerald: 'border-emerald-600 border-t-transparent',
        orange: 'border-orange-600 border-t-transparent',
        white: 'border-white border-t-transparent',
    };

    return (
        <div
            className={`${sizeClasses[size]} ${colorClasses[color]} border-4 rounded-full animate-spin ${className}`}
            role="status"
            aria-label="Chargement"
        >
            <span className="sr-only">Chargement...</span>
        </div>
    );
}
