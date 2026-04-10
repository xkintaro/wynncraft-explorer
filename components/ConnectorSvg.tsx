import { CONNECTOR_PATHS, CONNECTOR_SIZE } from '@/lib/constants';

interface ConnectorSvgProps {
    type: string;
    color: string;
    dashed?: boolean;
}

export default function ConnectorSvg({ type, color, dashed = false }: ConnectorSvgProps) {
    const s = CONNECTOR_SIZE;
    const w = 2.5;

    return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className="block">
            <path
                d={CONNECTOR_PATHS[type] || CONNECTOR_PATHS.connector_up_down}
                fill="none"
                stroke={color}
                strokeWidth={w}
                strokeLinecap="round"
                strokeDasharray={dashed ? '4 3' : 'none'}
            />
        </svg>
    );
}
