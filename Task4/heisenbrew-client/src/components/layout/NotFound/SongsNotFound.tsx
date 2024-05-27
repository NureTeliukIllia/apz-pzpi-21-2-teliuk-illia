import { FC } from "react";
import styles from "./NotFound.module.scss";

export const SongsNotFound: FC = () => {
    return (
        <div className={styles["not-found"]}>
            <h1>
                <span>⋆⋆✮♪♫🎧♫♪✮⋆⋆</span>
            </h1>
            <br />
            <p className={styles["nothing-found"]}> Nothing found</p>
            <p className={styles["description"]}>No songs here</p>
        </div>
    );
};
