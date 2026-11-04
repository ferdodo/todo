import { useEffect, useState, type ReactNode } from "react";
import QRCode from "qrcode";
import styles from "./DesktopNotice.module.css";

export function DesktopNotice(): ReactNode {
	const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

	useEffect(() => {
		QRCode.toDataURL(window.location.href, { margin: 1, width: 240 }).then(setQrCodeUrl);
	}, []);

	return (
		<main className={styles.container}>
			<div className={styles.card}>
				<h1 className={styles.title}>Todo is designed for mobile</h1>
				<p className={styles.text}>
					Scan this QR code with your phone to try it.
				</p>
				{qrCodeUrl && (
					<img className={styles.qrCode} src={qrCodeUrl} alt="QR code vers Todo" />
				)}
			</div>
		</main>
	);
}
