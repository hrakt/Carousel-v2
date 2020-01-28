import styles from "./Navbar.module.scss";
import cx from "classnames";

const Navbar = ({ currentSlide, slideArr, setCurrentSlide, setIsAnimating, setShifting }) => {
  const handleSwitch = index => {
    setCurrentSlide(index);
    setIsAnimating(true);
    setShifting(true);
  };
  return (
    <div className={styles.mainContainer}>
      {slideArr.map(index => (
        <div
          key={index}
          onClick={() => handleSwitch(index)}
          className={cx(styles.tick, { [styles.tick__selected]: currentSlide === index })}
        />
      ))}
    </div>
  );
};

export default Navbar;
