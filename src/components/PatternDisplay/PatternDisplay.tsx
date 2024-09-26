'use client'

import React, {useEffect, useState} from 'react'
import styles from './PatternDisplay.module.scss'

interface PatternDisplayProps {
	pattern: number[][];
	player: 'Player 1' | 'Player 2';
}

export const PatternDisplay: React.FC<PatternDisplayProps> = ({pattern, player}) => {
	const [isClient, setIsClient] = useState(false)
	
	// Устанавливаем флаг, что рендеринг на клиенте
	useEffect(() => {
		setIsClient(true)
	}, [])
	return (
		<div className={styles.patternGrid}>
			{pattern.map((row, rowIndex) => row.map((cell, colIndex) =>
					<div
						key={`${rowIndex}-${colIndex}`}
						className={`${styles.cell} ${
							isClient && cell === 1
								? player === 'Player 1'
									? styles.player1
									: styles.player2
								: ''
						}`}					/>
				)
			)}
		</div>
	)
}
