import { intervalToDuration } from 'date-fns';

type TimerProps = {
    timer: number;
}

export const Timer = ({ timer }: TimerProps) => {
    const obj = intervalToDuration({ end: timer * 1000, start: 0 });

    return (
        <div>
            {obj.hours ? `${obj.hours} :` : ''} {obj.minutes ? `${obj.minutes}:` : ''}{obj.seconds}
        </div>
    )
}