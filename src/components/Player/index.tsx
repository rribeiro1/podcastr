import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import { convertDurationToTimeString } from "../../utils/converter";

import Image from 'next/image';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';


export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const {
        episodes,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        togglePlay,
        toggleLoop,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        toggleShuffle,
        isShuffling,
        clearPlayerState
    } = usePlayer()


    useEffect(() => {
        if (!audioRef.current) {
            return
        }

        if (isPlaying) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying])

    function setProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            playNext()
        } else {
            clearPlayerState()
        }
    }

    const episode = episodes[currentEpisodeIndex]

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Playing now"/>
                <strong>Playing right now</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={420}
                        height={420}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Select a podcast for listening</strong>
                </div>
            ) }

            <footer className={episode ? '' : styles.empty}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>

                    <div className={styles.slider}>
                        { episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: "#04d361" }}
                                railStyle={{ backgroundColor: "#9f75ff" }}
                                handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}

                    </div>

                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                { episode && (
                  <audio
                    src={episode.url}
                    ref={audioRef}
                    autoPlay
                    loop={isLooping}
                    onPlay={() => setPlayingState(true)}
                    onPause={() => setPlayingState(false)}
                    onEnded={handleEpisodeEnded}
                    onLoadedMetadata={setProgressListener}
                  />
                ) }

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode || episodes.length === 1} onClick={toggleShuffle} className={isShuffling ? styles.isActive : ''}>
                        <img src="/shuffle.svg" alt="Shuffle"/>
                    </button>

                    <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
                        <img src="/play-previous.svg" alt="Previous"/>
                    </button>

                    <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
                        { isPlaying
                           ? <img src="/pause.svg" alt="Pause"/>
                           : <img src="/play.svg" alt="Play"/>
                        }
                    </button>

                    <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
                        <img src="/play-next.svg" alt="Next"/>
                    </button>

                    <button type="button" disabled={!episode} onClick={toggleLoop} className={isLooping ? styles.isActive : ''}>
                        <img src="/repeat.svg" alt="Repeat"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}