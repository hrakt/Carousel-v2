import styles from "./Slider.module.scss";

const Slider = ({ next, previous, isAnimating, handleClick }) => {
  return (
    <div className={styles.sliderContainer}>
      {previous && (
        <div className={styles.previous} onClick={() => [!isAnimating && handleClick(-1)]}>
          &#10094;
        </div>
      )}
      {next && (
        <div className={styles.next} onClick={() => [!isAnimating && handleClick(1)]}>
          &#10095;
        </div>
      )}
    </div>
  );
};

export default Slider;
