"use client";

import React, { useMemo, useCallback } from "react";
import {
  motion,
  useTransform,
  useScroll,
  useSpring,
  useInView,
  useMotionValue,
  MotionValue,
} from "framer-motion";
import Lenis from "@studio-freight/lenis";
import TeamFamilyTree from "../../../components/TeamFamilyTree/TeamFamilyTree";

// Animated counter
const AnimatedCounter = ({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.span
      ref={ref}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
      className="text-4xl md:text-5xl font-black"
    >
      {count}
      {suffix}
    </motion.span>
  );
};

// Floating particles (optimized)
const FloatingParticles = ({ isVisible = true }: { isVisible?: boolean }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: Math.random() * 12 + 8,
        delay: Math.random() * 2,
      })),
    []
  );

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-linear-to-r from-blue-400/20 to-red-400/20"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
            transform: "translateZ(0)",
            willChange: "transform",
          }}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 15, 0, -15, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Scroll progress
const ScrollProgress = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) => {
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 25,
    restDelta: 0.001,
  });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-red-500 to-blue-500 z-50 origin-left"
      style={{ scaleX, willChange: "transform", transform: "translateZ(0)" }}
    />
  );
};

// 3D Floating Shapes (GPU optimized)
const FloatingShapes = ({ isVisible = true }: { isVisible?: boolean }) => {
  if (!isVisible) return null;

  return (
    <>
      <div
        className="absolute top-20 left-[10%] w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none transform-gpu animate-float"
        style={{ transform: "translateZ(0)" }}
      />
      <div
        className="absolute bottom-20 right-[10%] w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none transform-gpu animate-pulse-slow"
        style={{ transform: "translateZ(0)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none transform-gpu animate-spin-slow"
        style={{ transform: "translateZ(0)" }}
      />
    </>
  );
};

const AboutClient = () => {
  React.useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false,
    });

    let reqId: number;
    function raf(time: number) {
      lenis.raf(time);
      reqId = requestAnimationFrame(raf);
    }
    reqId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(reqId);
      lenis.destroy();
    };
  }, []);

  const { scrollYProgress } = useScroll();

  // Hero parallax
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.96]);

  // High performance mouse tilt using MotionValues (no React re-renders)
  const heroMouseX = useMotionValue(0);
  const heroMouseY = useMotionValue(0);
  const smoothHeroRotateX = useSpring(heroMouseY, {
    stiffness: 100,
    damping: 25,
  });
  const smoothHeroRotateY = useSpring(heroMouseX, {
    stiffness: 100,
    damping: 25,
  });

  const heroRef = React.useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { margin: "100px" });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroMouseX.set(x * 16);
      heroMouseY.set(y * -12);
    },
    [heroMouseX, heroMouseY]
  );

  const handleMouseLeave = useCallback(() => {
    heroMouseX.set(0);
    heroMouseY.set(0);
  }, [heroMouseX, heroMouseY]);

  const card3DHover = {
    rest: {
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      boxShadow: "0px 0px 0px rgba(0,0,0,0)",
    },
    hover: {
      scale: 1.05,
      rotateY: 8,
      rotateX: 6,
      boxShadow:
        "0px 30px 40px rgba(0,0,0,0.5), 0px 0px 20px rgba(59,130,246,0.3)",
      transition: {
        duration: 0.3,
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const statsCardHover = {
    rest: { scale: 1 },
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 },
    },
  };

  // Image 3D tilt using MotionValues (no React re-renders)
  const imageMouseX = useMotionValue(0);
  const imageMouseY = useMotionValue(0);
  const smoothImageRotateX = useSpring(imageMouseY, {
    stiffness: 120,
    damping: 20,
  });
  const smoothImageRotateY = useSpring(imageMouseX, {
    stiffness: 120,
    damping: 20,
  });
  const imageRef = React.useRef<HTMLDivElement>(null);

  const handleImageMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      imageMouseX.set(x * 12);
      imageMouseY.set(y * -12);
    },
    [imageMouseX, imageMouseY]
  );

  const handleImageMouseLeave = useCallback(() => {
    imageMouseX.set(0);
    imageMouseY.set(0);
  }, [imageMouseX, imageMouseY]);

  return (
    <div className="relative bg-linear-to-b from-black via-gray-950 to-black text-white overflow-x-clip">
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <div
        className="fixed inset-0 opacity-20 pointer-events-none animate-pulse-slow"
        style={{
          background:
            "radial-gradient(circle at center, rgba(59,130,246,0.3) 0%, rgba(239,68,68,0.3) 100%)",
          transform: "translateZ(0)",
        }}
      />

      <FloatingParticles isVisible={isHeroInView} />

      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%3E%3Cfilter%20id%3D%22noise%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noise)%22%20opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')] opacity-30 pointer-events-none" />

      {/* HERO SECTION */}
      <motion.div
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          y: heroY,
          opacity: heroOpacity,
          scale: heroScale,
          rotateX: smoothHeroRotateX,
          rotateY: smoothHeroRotateY,
          transform: "translateZ(0)",
          willChange: "transform, opacity",
        }}
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative h-screen min-h-175 flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-blue-900/40 via-black/80 to-red-900/40 z-0" />
        <FloatingShapes isVisible={isHeroInView} />

        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6 px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-mono"
          >
            ✦ EST. 2025 ✦
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05, delayChildren: 0.2 }}
            className="mb-6 flex flex-wrap lg:flex-nowrap justify-center items-center gap-2 sm:gap-4 md:gap-6 whitespace-normal lg:whitespace-nowrap"
          >
            {["Aro", "Ekdin", "Team"].map((word, idx) => (
              <motion.span
                key={idx}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 12,
                  delay: idx * 0.08,
                }}
                className="inline-flex items-center shrink-0 text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight"
              >
                {word === "Aro" ? (
                  <>
                    <span className="bg-linear-to-r from-blue-500 via-white to-black/50 bg-clip-text text-transparent">
                      Ar
                    </span>
                    <img
                      src="https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145975/Logo_qzb1xk.jpg"
                      alt="o"
                      className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 object-cover rounded-full mx-1 sm:mx-1.5 border-2 border-white shrink-0"
                    />
                  </>
                ) : (
                  <span className="bg-linear-to-r from-blue-500 via-white to-black/50 bg-clip-text text-transparent">
                    {word}
                  </span>
                )}
              </motion.span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="w-32 h-1 bg-linear-to-r from-blue-500 to-red-500 mx-auto rounded-full mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto text-gray-200 font-light"
          >
            On the playground, we are not just a team, we are a family.
            <br />
            <span className="text-blue-400">
              Our goal is a healthy body and a beautiful mind.
            </span>
          </motion.p>
        </div>
      </motion.div>

      {/* ABOUT US SECTION */}
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 bg-black/40 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-4xl font-bold border-l-4 border-blue-500 pl-4 bg-linear-to-r from-blue-400 to-white bg-clip-text text-transparent">
              About Us
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              &quot;Aro Ekdin Team&quot; is a group of energetic young people
              who consider sports an integral part of life. Fighting on the field
              teaches patience, unity, and leadership.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                variants={statsCardHover}
                initial="rest"
                whileHover="hover"
                className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10"
              >
                <AnimatedCounter value={18} suffix="+" />
                <p className="text-gray-400 mt-2">Active Members</p>
              </motion.div>
              <motion.div
                variants={statsCardHover}
                initial="rest"
                whileHover="hover"
                className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10"
              >
                <AnimatedCounter value={5} suffix="+" />
                <p className="text-gray-400 mt-2">Victorious Tournaments</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onMouseMove={handleImageMouseMove}
            onMouseLeave={handleImageMouseLeave}
            className="relative group"
          >
            <motion.div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-red-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition" />
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{
                rotateX: smoothImageRotateX,
                rotateY: smoothImageRotateY,
                transform: "translateZ(0)",
              }}
            >
              <img
                src="https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145679/IMG_2008_uxdtnc.jpg"
                alt="Aro Ekdin Volleyball Team in action"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="relative py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-black italic mb-16 bg-linear-to-r from-blue-500 to-white bg-clip-text text-transparent">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤝",
                title: "Unity",
                desc: "On the field and off the field, we are always by each other's side.",
                color: "from-blue-500 to-cyan-400",
              },
              {
                icon: "🏆",
                title: "Sportsmanship",
                desc: "Whether we win or lose, we always accept it with respect.",
                color: "from-green-500 to-emerald-400",
              },
              {
                icon: "🔥",
                title: "Determination",
                desc: "Every match is an opportunity for us to learn and grow.",
                color: "from-red-500 to-orange-400",
              },
            ].map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover="hover"
                variants={card3DHover}
                className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 cursor-pointer group"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-6xl mb-4"
                >
                  {val.icon}
                </motion.div>
                <h3
                  className={`text-2xl font-bold mb-3 bg-linear-to-r ${val.color} bg-clip-text text-transparent`}
                >
                  {val.title}
                </h3>
                <p className="text-gray-300">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-16 md:py-24"
      >
        <div className="relative group">
          <div className="absolute -inset-2 bg-linear-to-r from-blue-600 to-red-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition" />
          <div className="relative bg-black/60 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10">
            <div className="p-8 text-center">
              <h2 className="text-4xl md:text-5xl font-black italic mb-3 pb-4 text-transparent bg-clip-text bg-linear-to-r from-blue-800 to-white">
                Our Playing Ground
              </h2>
              <p className="text-gray-300 mb-6">
                Practice sessions are held at our ground every evening.
              </p>
              <div className="flex justify-center items-center text-blue-400 font-semibold mb-6 gap-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  Mohisher Ghop, Alfadanga, Faridpur, Dhaka, Bangladesh.
                </span>
              </div>
            </div>
            <div className="w-full h-112.5 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1832.775843455156!2d89.73007355954498!3d23.259395554596466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ffc9fa0acf9673%3A0x72e014ea3c63bd39!2sMohisharghop%20Government%20Primary%20School!5e0!3m2!1sen!2sbd!4v1775473690863!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                title="Aro Ekdin Volleyball Playing Ground"
                className="brightness-90 transition duration-500 group-hover:brightness-100"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        className="h-px bg-linear-to-r from-transparent via-blue-500 to-transparent w-full"
      />
    </div>
  );
};

export default AboutClient;
