import * as React from 'react';
import './style.css';

interface ICardInfoProps {
    children?: React.ReactNode | React.ReactNode[];
}

function CardInfo(props: ICardInfoProps) {
    return (
        <div className='CardInfo-container'>
            {props.children}
        </div>
    );
}

export default React.memo(CardInfo);

