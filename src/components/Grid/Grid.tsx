'use client';

import React from 'react'
import styles from './Grid.module.scss'

interface GridProps {
	grid: (string | null)[][];
	handleCellClick: (row: number, col: number) => void;
	winningCells: { row: number; col: number }[];
}

export const Grid: React.FC<GridProps> = ({ grid, handleCellClick, winningCells }) => {
	return (
		<div className={styles.grid}>
			{grid.map((row, rowIndex) => (
				<div key={rowIndex} className={styles.row}>
					{row.map((cell, colIndex) => (
						<div
							key={colIndex}
							className={`${styles.cell} ${
								cell === 'Player 1'
									? styles['player-1']
									: cell === 'Player 2'
										? styles['player-2']
										: ''
							} ${winningCells.some(c => c.row === rowIndex && c.col === colIndex) ? styles.winningCell : ''}`}
							onClick={() => handleCellClick(rowIndex, colIndex)}
						>
							<div className={styles.ball}></div>
						</div>
					))}
				</div>
			))}
		</div>
	);
};
