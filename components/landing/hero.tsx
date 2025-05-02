"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { ChatBox } from "@/components/landing/chat";
import { SetStateAction } from "react";
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
    <div className="h-full w-full isolate overflow-hidden">
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
            className="text-3xl font-bold tracking-tight sm:text-2xl md:text-3xl lg:text-5xl"
            variants={itemVariants}
          >
            Let your thoughts take shape {" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              with AI
            </span>
          </motion.h1>
          <motion.p
            className="my-6 text-lg leading-8 text-muted-foreground md:text-xl max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Transform your ideas into professional presentations in seconds.
          </motion.p>
        </motion.div>

        <ChatBox setIsError={function (value: SetStateAction<boolean>): void {

        }} setInput={function (value: SetStateAction<string>): void {

        }} />
      </div>

      {/* Bottom background gradient */}
      <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  );
}