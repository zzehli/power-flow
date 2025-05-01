"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export function Testimonials() {
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const testimonials = [
    {
      content:
        "Point Flow saved me countless hours. I was able to create a pitch deck in 20 minutes that would have taken me days to make on my own.",
      author: {
        name: "Sarah Johnson",
        role: "Marketing Director",
      },
    },
    {
      content:
        "The quality of presentations I can create with Point Flow is far beyond what I could achieve with traditional tools. The AI suggestions are incredibly helpful.",
      author: {
        name: "Michael Chen",
        role: "Product Manager",
      },
    },
    {
      content:
        "As someone who dreads making slides, this tool has been a game-changer for my weekly team updates. Professional results with minimal effort.",
      author: {
        name: "Alex Rivera",
        role: "Team Lead",
      },
    },
  ];

  return (
    <div className="py-24 bg-background" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-base font-semibold leading-7 text-blue-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by professionals everywhere
          </p>
        </motion.div>
        <motion.div
          className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="flex flex-col justify-between bg-muted/30 p-6 shadow-sm rounded-xl border"
              variants={itemVariants}
            >
              <div>
                <p className="text-lg font-medium leading-8 text-foreground">
                  {testimonial.content}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={undefined} alt={testimonial.author.name} />
                  <AvatarFallback>{testimonial.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{testimonial.author.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.author.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}