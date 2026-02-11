"use client";

// TODO: Import dependencies yang diperlukan
// import { motion } from "motion/react";
// import { ... } from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
} from "lucide-react";

type PlayerState = "playing" | "paused" | "loading";

type Song = {
  title: string;
  artist: string;
  src: string;
};

/* ================= VARIANTS ================= */

const stateVariants = {
  playing: {
    backgroundColor: "#1a1a1a",
    boxShadow: "0 0 40px rgba(139, 92, 246, 0.35)",
  },
  paused: {
    backgroundColor: "#0F0F0F",
    boxShadow: "0px 4px 20px 0px rgba(0,0,0,0.5)",
  },
  loading: {
    backgroundColor: "#0F0F0F",
    boxShadow: "0px 4px 20px 0px rgba(0,0,0,0.5)",
  },
};

// Album artwork
const albumVariants = {
  playing: {
    rotate: 360,
    scale: 1,
    transition: {
      rotate: {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      },
      scale: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  },
  paused: {
    rotate: 0,
    scale: 0.95,
    transition: {
      scale: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  },
  loading: {
    rotate: 0,
    scale: 0.9,
    opacity: 0.5,
    transition: {
      scale: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  },
};

// Equalizer
const equalizerBarVariants = {
  playing: (i: number) => ({
    scaleY: [0.2, 1],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse" as const,
      delay: i * 0.1,
      ease: "easeInOut" as const,
    },
  }),
  paused: {
    scaleY: 0.2,
  },
  loading: {
    scaleY: 0.5,
    opacity: 0.5,
  },
};

// Play button
const playButtonVariants = {
  loading: {
    backgroundColor: "#555",
  },
  playing: {
    backgroundColor: "#8b5cf6",
  },
  paused: {
    backgroundColor: "#8b5cf6",
  },
};

/* ================= PLAYLIST ================= */

const playlist: Song[] = [
  {
    title: "Die With A Smile",
    artist: "Lady Gaga, Bruno Mars",
    src: "/Lady Gaga, Bruno Mars - Die With A Smile.mp3",
  },
  {
    title: "Set Fire to The Rain",
    artist: "Adele",
    src: "/Adele - Set Fire to The Rain.mp3",
  },
  {
    title: "You Are The Reason",
    artist: "Calum Scott",
    src: "/Calum Scott - You Are The Reason.mp3",
  },
];

export function MusicPlayer() {
  // TODO: Implementasikan state management untuk playing, paused, loading

  // TODO: Implementasikan handler untuk play/pause

  // TODO: Implementasikan komponen music player sesuai desain Figma
  // Struktur yang perlu dibuat:
  // - Container dengan background dan shadow animations
  // - Album artwork dengan rotation dan scale animations
  // - Equalizer bars dengan stagger effect
  // - Progress bar dengan fill animation
  // - Control buttons (play/pause, skip, volume)
  const [state, setState] = useState<PlayerState>("paused");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [volume, setVolume] = useState(0.66);

  const lock = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSong = playlist[currentIndex];

  /* ================= Helpers ================= */

  function formatTime(time: number) {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function getRandomIndex(exclude: number) {
    let random;
    do {
      random = Math.floor(Math.random() * playlist.length);
    } while (random === exclude);
    return random;
  }

  function handleNext() {
    setCurrentIndex((prev) =>
      isShuffle
        ? getRandomIndex(prev)
        : prev === playlist.length - 1
          ? 0
          : prev + 1,
    );
  }

  function handlePrev() {
    setCurrentIndex((prev) =>
      isShuffle
        ? getRandomIndex(prev)
        : prev === 0
          ? playlist.length - 1
          : prev - 1,
    );
  }

  /* ================= AUDIO ================= */

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.load();
    setCurrentTime(0);

    if (state === "playing") {
      audioRef.current.play();
    }
  }, [currentIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  async function toggle() {
    if (lock.current) return;
    lock.current = true;

    const nextState: PlayerState = state === "playing" ? "paused" : "playing";

    setState("loading");
    await new Promise((r) => setTimeout(r, 500));
    if (nextState === "playing") {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }

    setState(nextState);
    lock.current = false;
  }

  /* ================= PROGRESS ================= */

  const progress = duration ? currentTime / duration : 0;

  /* ================= UI ================= */

  return (
    <motion.div
      variants={stateVariants}
      animate={state}
      initial="paused"
      className="w-full max-w-125 max-h-89.5 rounded-2xl p-16"
    >
      {/* TODO: Implementasikan music player di sini */}
      {/* AUDIO ELEMENT */}
      <audio
        ref={audioRef}
        src={currentSong.src}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={() => {
          if (isRepeat && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else {
            handleNext();
          }
        }}
      />
      <div className="relative flex flex-col gap-20 justify-center">
        <div className="w-full flex justify-start gap-24">
          <motion.div
            variants={albumVariants}
            animate={state}
            className="h-120 w-120 aspect-square flex items-center justify-center rounded-xl bg-gradient-primary"
          >
            <p className="display-2xl-bold">🎵</p>
          </motion.div>
          <div className="w-full flex flex-col items-start justify-center gap-10 ">
            <h3 className="text-neutral-100 text-lg font-semibold">
              {currentSong.title}
            </h3>
            <p className="text-neutral-400 text-sm">{currentSong.artist}</p>
          </div>
        </div>

        {/* Equalizer */}
        <div className="absolute -mt-32 mb-30 ml-36 flex h-24 items-end gap-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={equalizerBarVariants}
              animate={state}
              style={{ transformOrigin: "bottom" }}
              className="w-8 h-full bg-primary-200 will-change-transform"
            />
          ))}
        </div>

        {/* Progress */}
        <div className="mt-20">
          <div className="h-8 rounded-full bg-neutral-800 overflow-hidden">
            <motion.div
              className="h-full origin-left will-change-transform"
              animate={{
                scaleX: progress,
                backgroundColor:
                  state === "playing"
                    ? "var(--color-primary-200)"
                    : "var(--color-neutral-500)",
              }}
            />
          </div>
          <div className="mt-20 flex justify-between text-12 text-neutral-500 text-xs">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="mt-0 flex items-center justify-center gap-20">
          <motion.div
            onClick={() =>
              setIsShuffle((prev) => {
                const next = !prev;
                if (next) setIsRepeat(false);
                return next;
              })
            }
            whileHover={{ color: "#ffffff" }}
            whileTap={{ scale: 0.9 }}
            animate={{
              color: isShuffle
                ? "var(--color-primary-200)"
                : "var(--color-neutral-300)",
              scale: isShuffle ? 1.15 : 1,
            }}
            className="cursor-pointer"
          >
            <Shuffle size={20} />
          </motion.div>
          <motion.div
            whileHover={{ color: "#ffffff" }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="text-neutral-300 cursor-pointer"
          >
            <SkipBack size={20} />
          </motion.div>
          <motion.button
            onClick={toggle}
            disabled={state === "loading"}
            variants={playButtonVariants}
            animate={state}
            whileHover={state !== "loading" ? { scale: 1.05 } : {}}
            whileTap={state !== "loading" ? { scale: 0.95 } : {}}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="h-56 w-56 rounded-full flex items-center justify-center cursor-pointer"
          >
            <AnimatePresence mode="wait">
              {state === "playing" ? (
                <motion.div
                  key="pause"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Pause size={20} className="text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Play size={20} className="text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.div
            whileHover={{ color: "#ffffff" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="text-neutral-300 cursor-pointer"
          >
            <SkipForward size={20} />
          </motion.div>
          <motion.div
            onClick={() =>
              setIsRepeat((prev) => {
                const next = !prev;
                if (next) setIsShuffle(false);
                return next;
              })
            }
            whileHover={{ color: "#ffffff" }}
            whileTap={{ scale: 0.9 }}
            animate={{
              color: isRepeat
                ? "var(--color-primary-200)"
                : "var(--color-neutral-300)",
              scale: isRepeat ? 1.15 : 1,
            }}
            className="cursor-pointer"
          >
            <Repeat size={20} />
          </motion.div>
        </div>

        {/* Volume */}
        <div className="h-16 flex items-center gap-8">
          <Volume2 size={16} className="text-neutral-400" />
          <div
            className="relative h-4 w-full rounded bg-neutral-800 cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const newVolume = (e.clientX - rect.left) / rect.width;
              setVolume(Math.min(Math.max(newVolume, 0), 1));
            }}
          >
            <motion.div
              className="h-full origin-left bg-neutral-500 will-change-transform"
              animate={{ scaleX: volume }}
              whileHover={{
                backgroundColor: "var(--color-primary-200)",
              }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
