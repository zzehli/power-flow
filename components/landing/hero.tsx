"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

export function Hero() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative isolate overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-x-0 top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="container m-auto py-24 md:py-32" ref={ref}>
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            variants={itemVariants}
          >
            Create stunning presentations with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              AI-powered tools
            </span>
          </motion.h1>
          <motion.p
            className="mt-6 text-lg leading-8 text-muted-foreground md:text-xl max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Transform your ideas into professional presentations in seconds. Let AI do the
            heavy lifting while you focus on what matters most.
          </motion.p>
          <motion.div
            className="mt-10 flex items-center justify-center gap-x-6"
            variants={itemVariants}
          >
            <Link href="/auth/signin">
              <Button size="lg" className="rounded-full px-8">
                Get started
              </Button>
            </Link>
            <Link
              href="/features"
              className="text-sm font-semibold leading-6 text-muted-foreground hover:text-foreground"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Animated presentation mockup */}
        <motion.div
          className="mt-16 sm:mt-24 relative mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{
            duration: 0.8,
            delay: 0.4,
            ease: [0.04, 0.62, 0.23, 0.98]
          }}
        >
          <div className="relative rounded-xl shadow-2xl overflow-hidden bg-gray-800">
            <div className="h-10 bg-gray-900 flex items-center px-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="mx-auto text-white text-xs">PresentAI Editor</div>
            </div>
            <div className="h-[400px] bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col justify-center items-center p-6 text-white">
              <div className="w-full grid grid-cols-2 gap-6 h-full">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="h-6 w-32 bg-gray-700 rounded-md animate-pulse"></div>
                  <div className="h-4 w-48 bg-gray-700 rounded-md animate-pulse"></div>
                  <div className="h-24 w-full bg-gray-700 rounded-md animate-pulse mt-4"></div>
                </div>
                <div className="h-full flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-float"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom background gradient */}
      <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  );
}