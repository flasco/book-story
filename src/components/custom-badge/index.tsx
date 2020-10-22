import styles from './index.m.scss';

const CustomBadge = ({ text, background = 'red', color = '#fff' }) => {
  return (
    <div className={styles.badge} style={{ backgroundColor: background, color }}>
      {text}
    </div>
  );
};

export default CustomBadge;
