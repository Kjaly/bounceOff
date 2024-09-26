import styles from './page.module.scss'
import {BounceOff} from '@/components'

export default function Home() {
  return (
    <div className={styles.page}>
      <BounceOff/>
    </div>
  );
}
