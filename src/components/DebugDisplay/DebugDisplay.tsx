'use client';

import React from 'react'
import styles from './DebugDisplay.module.scss'

interface DebugDisplayProps {
	winningCells: [number, number][];
	checkResults: number[][];
}

export const DebugDisplay: React.FC<DebugDisplayProps> = ({ winningCells, checkResults }) => {
	return (
		<div className={styles.debugContainer}>
			<h3>Winning Cells:</h3>
			<div className={styles.debugGrid}>
				{checkResults.map((row, rowIndex) => (
					<div key={rowIndex} className={styles.debugRow}>
						{row.map((cell, colIndex) => (
							<div
								key={colIndex}
								className={`${styles.debugCell} ${winningCells.some(([r, c]) => r === rowIndex && c === colIndex) ? styles.winning : ''}`}
							>
								{cell}
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};
