import '@/styles/global.scss' // Подключаем глобальные стили

export default function RootLayout({
	                                   children
                                   }: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
		<body>
		{children}
		</body>
		</html>
	)
}
