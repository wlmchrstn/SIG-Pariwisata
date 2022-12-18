import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './landing.module.scss';
import sideDecorIcon from '../../assets/icons/sideDecor.svg';
const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <section className={styles.root}>
            <div className={styles.body}>
                <div className={styles.heading}>Sistem Informasi Geografis</div>
                <div className={styles.title}>Rute Perjalanan Pariwisata</div>
                <div className={styles.step}>
                    <div className={styles['step-wrapper']}>
                        <div className={styles['step-item']}>
                            <div className={styles['step-item-title']}>Pilih Tujuan</div>
                            <div className={styles['step-item-desc']}>Pilih tujuan wisatamu</div>
                        </div>
                        <div className={styles['step-item']}>
                            <div className={styles['step-item-title']}>Atur Urutan Jalanmu</div>
                            <div className={styles['step-item-desc']}>Atur urutan perjalananmu</div>
                        </div>
                        <div className={styles['step-item']}>
                            <div className={styles['step-item-title']}>Review Perjalanan Wisatamu</div>
                            <div className={styles['step-item-desc']}>Finalisasi Rute Perjalanan</div>
                        </div>
                    </div>
                    <div className={styles['step-image']}>
                        <img src={sideDecorIcon} alt={'sideDecor-icon'} />
                    </div>
                </div>
                <div className={styles['button-label']}>Rencanakan Rute Pariwisatamu Sekarang</div>
                <button className={styles.button} onClick={() => navigate('/location')}>Mulai</button>
            </div>
        </section>
    );
};

export default LandingPage;
