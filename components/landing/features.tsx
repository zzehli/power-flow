"use client";

import { LayoutTemplate, Wand2, PenTool, BarChart4, Clock, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export function Features() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const features = [
    {
      name: "Smart Templates",
      description:
        "Choose from hundreds of professionally designed templates or let AI generate one based on your content.",
      icon: LayoutTemplate,
    },
    {
      name: "AI Content Generation",
      description:
        "Transform your ideas into well-structured content with just a few prompts.",
      icon: Wand2,
    },
    {
      name: "Design Assistance",
      description:
        "Get AI-powered design suggestions for colors, typography, and layouts that match your brand.",
      icon: PenTool,
    },
    {
      name: "Data Visualization",
      description:
        "Turn complex data into compelling charts and graphs that tell your story.",
      icon: BarChart4,
    },
    {
      name: "Time-Saving",
      description:
        "Create presentation-ready slides in minutes, not hours.",
      icon: Clock,
    },
    {
      name: "Professional Results",
      description:
        "Impress your audience with polished, professional presentations every time.",
      icon: ThumbsUp,
    },
  ];

  return (
    <div className="py-24 bg-muted/50" ref={ref}>
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to create amazing presentations
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our AI-powered platform provides all the tools you need to create
            professional presentations quickly and easily.
          </p>
        </div>
        <motion.div
          className="mx-auto mt-16 max-w-4xl sm:mt-20 lg:mt-24 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div key={index} className="relative" variants={itemVariants}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-600 text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{feature.name}</h3>
              </div>
              <p className="mt-3 text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}