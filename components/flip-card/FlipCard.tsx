// components/flip-card.tsx

import { ReactNode } from "react";
import styles from './FlipCard.module.scss';
import { useFlip } from "@providers/flip-provider";
import classNames from 'classnames';

interface FlipCardProps {
    frontContent: ReactNode;
    backContent: ReactNode;
}

export const FlipCard = ({ frontContent, backContent }: FlipCardProps) => {
    const { isFlipped, flipElementRef } = useFlip();
    return (
        <div ref={flipElementRef} className={classNames(styles['flip-card'], { [styles.flipped]: isFlipped })}>
            <div className={styles['flip-card-inner']}>
                <div className={styles['flip-card-front']}>
                    {frontContent}
                </div>
                <div className={styles['flip-card-back']}>
                    {backContent}
                </div>
            </div>
        </div>
    );
};
