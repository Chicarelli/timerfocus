import { intervalToDuration } from 'date-fns';

type TimerProps = {
    timer: number;
}

export const Timer = ({ timer }: TimerProps) => {
    const obj = intervalToDuration({ end: timer * 1000, start: 0 });

    return (
        <div>
            {obj.hours ? `${obj.hours} :` : ''} {obj.minutes ? `${obj.minutes >= 10 ? obj.minutes : `0${obj.minutes}`}:` : '00'}{obj.seconds ? obj.seconds >= 10 ? obj.seconds : `0${obj.seconds}` : '00'}
        </div>
    )
}