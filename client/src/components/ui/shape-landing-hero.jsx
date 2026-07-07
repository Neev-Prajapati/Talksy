"use client";;
import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "../../lib/utils";
import CoolButton from "../coolbutton";
import { Link } from "react-router-dom";


function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]"
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}>
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative">
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )} />
            </motion.div>
        </motion.div>
    );
}

function HeroGeometric({
    badge = "Design Collective",
    title1 = "Elevate Your Digital Vision",
    title2 = "Crafting Exceptional Websites"
}) {
    // Check if user is already logged in
    const isLoggedIn = !!(localStorage.getItem("token") && localStorage.getItem("user"));
    const ctaLink = isLoggedIn ? "/chats" : "/login";

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    return (
        <div
            className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0b]">
            <div
                className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.07] via-transparent to-indigo-500/[0.07] blur-3xl" />

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-violet-500/[0.15]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]" />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-indigo-500/[0.15]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]" />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-fuchsia-500/[0.15]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]" />

                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-cyan-500/[0.15]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]" />

                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient="from-violet-500/[0.15]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]" />
            </div>
            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12">
                        <Circle className="h-2 w-2 fill-violet-500/80" />
                        <span className="text-sm text-white/60 tracking-wide">
                            {badge}
                        </span>
                    </motion.div>

                    <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
                        <h1
                            className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                            <span
                                className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                                {title1}
                            </span>
                            <br />
                            <span
                                className={cn(
                                    "bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-white/90 to-indigo-300 "
                                )}>
                                {title2}
                            </span>
                        </h1>
                    </motion.div>

                    {/* Subtitle */}
                    <motion.p
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-base sm:text-lg text-white/40 max-w-lg mx-auto mb-8 md:mb-10 leading-relaxed">
                        Connect with friends in real-time. Fast, simple, and beautifully crafted for the way you communicate.
                    </motion.p>

                    <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible">
                       <Link to={ctaLink}> <CoolButton/></Link>
                    </motion.div>
                </div>
            </div>
            <div
                className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-[#0a0a0b]/80 pointer-events-none" />
        </div>
    );
}

export { HeroGeometric }
