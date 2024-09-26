import React from 'react'
import styles from './Modal.module.scss'

export const Modal: React.FC<{ message: string, onClose: () => void }> = ({ message, onClose }) => (
	<div className={styles.modalOverlay}>
		<div className={styles.modal}>
			<h2>{message}</h2>
			<button onClick={onClose} className={styles.resetButton}>Restart Game</button>
		</div>
	</div>
)
