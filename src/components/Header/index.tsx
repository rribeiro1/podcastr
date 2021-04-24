import styles from './styles.module.scss';
import format from 'date-fns/format'
import enUs from 'date-fns/locale/en-US'

export function Header() {
    const currentDate = format(new Date(), 'EEE, d MMMM', {
        locale: enUs
    })

    return (
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="Podcastr" />
            <p>The best content for you, always</p>
            <span>{currentDate}</span>
        </header>
    );
}