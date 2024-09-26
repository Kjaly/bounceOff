'use client';

import React, {useEffect, useState} from 'react'
import styles from './BounceOff.module.scss'
import {PatternDisplay} from '@/components/PatternDisplay/PatternDisplay'
import {Modal} from '@/components/Modal/Modal'

const ROWS = 6;
const COLS = 6;

type Player = 'Player 1' | 'Player 2' | null;
type Grid = Player[][];
type CheckResult = {
	row: number;
	col: number;
	player: Player;
	status: 'success' | 'failure';  // Статус успешной или неудачной проверки
};

const patterns = [
	// T-образная фигура (5 заполненных ячеек)
	[
		[0, 0, 1, 0, 0, 0],
		[0, 1, 1, 1, 0, 0],
		[0, 0, 1, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
	],
	// L-образная фигура (5 заполненных ячеек)
	[
		[1, 0, 0, 0, 0, 0],
		[1, 0, 0, 0, 0, 0],
		[1, 0, 0, 0, 0, 0],
		[1, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
	],
	// Г-образная фигура (5 заполненных ячеек)
	[
		[0, 0, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 1],
		[0, 0, 0, 1, 1, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
	],
	// Прямая линия (5 заполненных ячеек)
	[
		[0, 0, 0, 0, 0, 0],
		[0, 1, 1, 1, 1, 1],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
	],
];

// Функция для переворота паттерна по горизонтали
const flipPatternHorizontally = (pattern: number[][]): number[][] => {
	return pattern.map(row => row.slice().reverse());
};

// Функция для переворота паттерна по вертикали
const flipPatternVertically = (pattern: number[][]): number[][] => {
	return pattern.slice().reverse();
};

const directions = [
	{ row: -1, col: 0 }, // Вверх
	{ row: 1, col: 0 },  // Вниз
	{ row: 0, col: -1 }, // Влево
	{ row: 0, col: 1 },  // Вправо
];

// Функция для поиска всех связанных ячеек игрока (рекурсивно)
const findWinningCells = (
	grid: Grid,
	player: Player,
	row: number,
	col: number,
	visited: Set<string>,
	winningCells: { row: number, col: number }[],
	checkResult: CheckResult[]
): void => {
	if (visited.has(`${row}-${col}`)) return;
	
	visited.add(`${row}-${col}`);
	winningCells.push({ row, col });
	checkResult.push({ row, col, player, status: 'success' });
	
	for (const { row: dRow, col: dCol } of directions) {
		const newRow = row + dRow;
		const newCol = col + dCol;
		
		if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS) continue;
		
		if (grid[newRow][newCol] === player) {
			findWinningCells(grid, player, newRow, newCol, visited, winningCells, checkResult);
		}
	}
};

// Функция для проверки совпадения с паттерном
const matchesPattern = (
	pattern: number[][],
	winningCells: { row: number, col: number }[],
	checkResult: CheckResult[]
): { row: number, col: number }[] | null => {
	const patternCoords = pattern.reduce((acc, rowArr, rowIndex) => {
		rowArr.forEach((cell, colIndex) => {
			if (cell === 1) acc.push({ row: rowIndex, col: colIndex });
		});
		return acc;
	}, [] as { row: number, col: number }[]);
	
	if (winningCells.length < patternCoords.length) return null;
	
	for (const baseCell of winningCells) {
		const potentialPattern = patternCoords.map(coord => ({
			row: baseCell.row + coord.row - patternCoords[0].row,
			col: baseCell.col + coord.col - patternCoords[0].col,
		}));
		
		const isMatch = potentialPattern.every(({ row, col }) =>
			winningCells.some(cell => cell.row === row && cell.col === col)
		);
		
		if (isMatch) {
			potentialPattern.forEach(({ row, col }) => {
				checkResult.push({ row, col, player: 'Player 1', status: 'success' });
			});
			return potentialPattern;
		}
	}
	
	return null;
};

// Новая функция для проверки перевёрнутых паттернов
const checkAllPatternVariants = (
	pattern: number[][],
	winningCells: { row: number, col: number }[],
	checkResult: CheckResult[]
) => {
	// Проверяем оригинальный паттерн
	let matchedPattern = matchesPattern(pattern, winningCells, checkResult);
	if (matchedPattern) return matchedPattern;
	
	// Проверяем перевёрнутый по горизонтали
	const flippedHorizontally = flipPatternHorizontally(pattern);
	matchedPattern = matchesPattern(flippedHorizontally, winningCells, checkResult);
	if (matchedPattern) return matchedPattern;
	
	// Проверяем перевёрнутый по вертикали
	const flippedVertically = flipPatternVertically(pattern);
	matchedPattern = matchesPattern(flippedVertically, winningCells, checkResult);
	if (matchedPattern) return matchedPattern;
	
	// Проверяем полностью перевёрнутый (по горизонтали и вертикали)
	const flippedBoth = flipPatternVertically(flippedHorizontally);
	matchedPattern = matchesPattern(flippedBoth, winningCells, checkResult);
	if (matchedPattern) return matchedPattern;
	
	return null;
};

export const BounceOff: React.FC = () => {
	const [grid, setGrid] = useState<Grid>(
		Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
	);
	const [currentPlayer, setCurrentPlayer] = useState<Player>('Player 1');
	const [winner, setWinner] = useState<Player | null>(null);
	const [player1Pattern, setPlayer1Pattern] = useState<number[][]>(
		patterns[Math.floor(Math.random() * patterns.length)]
	);
	const [player2Pattern, setPlayer2Pattern] = useState<number[][]>(
		patterns[Math.floor(Math.random() * patterns.length)]
	);
	const [draw, setDraw] = useState<boolean>(false);
	const [winningCells, setWinningCells] = useState<{ row: number, col: number }[]>([]);
	const [checkResult, setCheckResult] = useState<CheckResult[]>([]);
	const [currentPattern, setCurrentPattern] = useState<number[][]>(player1Pattern);
	const [isClient, setIsClient] = useState(false);
	
	useEffect(() => {
		setIsClient(true);
	}, []);
	
	
	
	const handleCellClick = (row: number, col: number) => {
		if (grid[row][col] !== null || winner || draw) return;
		
		const newGrid = grid.map((r) => [...r]);
		newGrid[row][col] = currentPlayer;
		setGrid(newGrid);
		
		const currentPatternToCheck =
			currentPlayer === 'Player 1' ? player1Pattern : player2Pattern;
		
		setCurrentPattern(currentPatternToCheck);
		
		const result: CheckResult[] = [];
		
		const visited = new Set<string>();
		const winningCells: { row: number, col: number }[] = [];
		findWinningCells(newGrid, currentPlayer, row, col, visited, winningCells, result);
		
		const matchedCells = checkAllPatternVariants(currentPatternToCheck, winningCells, result);
		setCheckResult(result);
		
		if (matchedCells) {
			setWinner(currentPlayer);
			setWinningCells(matchedCells);
		} else if (newGrid.flat().every((cell) => cell !== null)) {
			setDraw(true);
		} else {
			setCurrentPlayer(currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1');
		}
	};
	
	const resetGame = () => {
		setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
		setWinner(null);
		setDraw(false);
		setWinningCells([]);
		setCheckResult([]);
		setPlayer1Pattern(patterns[Math.floor(Math.random() * patterns.length)]);
		setPlayer2Pattern(patterns[Math.floor(Math.random() * patterns.length)]);
		setCurrentPlayer('Player 1');
		setCurrentPattern(player1Pattern);
	};
	
	const getCellStatus = (row: number, col: number): 'success' | 'failure' | null => {
		const result = checkResult.find((r) => r.row === row && r.col === col);
		return result ? result.status : null;
	};
	
	if (!isClient) return null;
	
	return (
		<div className={styles.gameWrapper}>
			<div className={styles.patterns}>
				<div className={styles.patternWrapper}>
					<h3 className={styles.playerName}>Шаблон Игрока 1</h3>
					<PatternDisplay pattern={player1Pattern} player="Player 1" />
				</div>
			</div>
			
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
			
			<div className={styles.patterns}>
				<div className={styles.patternWrapper}>
					<h3 className={styles.playerName}>Шаблон Игрока 2</h3>
					<PatternDisplay pattern={player2Pattern} player="Player 2" />
				</div>
			</div>
			
			{winner && (
				<Modal message={`Победитель: ${winner}!`} onClose={resetGame} />
			)}
			{draw && <Modal message="Ничья!" onClose={resetGame} />}
			
			<div className={styles.debugGrid}>
				<h3>Результат проверки (двумерный массив):</h3>
				<div className={styles.debugTable}>
					{Array(ROWS).fill(null).map((_, rowIndex) => (
						<div key={rowIndex} className={styles.debugRow}>
							{Array(COLS).fill(null).map((_, colIndex) => {
								const status = getCellStatus(rowIndex, colIndex);
								return (
									<div
										key={colIndex}
										className={`${styles.debugCell} ${
											status === 'success'
												? styles.success
												: status === 'failure'
													? styles.failure
													: ''
										}`}
									>
										{status === 'success' ? '✔️' : status === 'failure' ? '❌' : ''}
									</div>
								);
							})}
						</div>
					))}
				</div>
				
				<h3>Текущий паттерн для проверки:</h3>
				<div className={styles.debugTable}>
					{currentPattern.map((row, rowIndex) => (
						<div key={rowIndex} className={styles.debugRow}>
							{row.map((cell, colIndex) => (
								<div
									key={colIndex}
									className={`${styles.debugCell} ${
										cell === 1 ? styles.success : ''
									}`}
								>
									{cell === 1 ? '🟢' : ''}
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
