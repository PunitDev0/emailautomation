"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Activity,
  Clock,
  RotateCcw,
  Zap,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import Image from "next/image";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const phoneRef = useRef(null);
  const featuresRef = useRef(null);
  const premiumRef = useRef(null);
  const testimonialRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" }
      );

      gsap.fromTo(
        ".hero-button",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.6,
          ease: "back.out(1.7)",
        }
      );

      // Phone animation
      gsap.fromTo(
        ".hero-phone",
        { opacity: 0, y: 100, rotateY: 15 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 1.2,
          delay: 0.8,
          ease: "power3.out",
        }
      );

      // Features scroll animation
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 80, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-section",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Premium section animation
      gsap.fromTo(
        ".premium-content",
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".premium-section",
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".premium-image",
        { opacity: 0, x: 100, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".premium-section",
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Testimonial animation
      gsap.fromTo(
        ".testimonial-content",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".testimonial-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Floating animation for phones
      gsap.to(".floating-phone", {
        y: -20,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
    const cardRef = useRef(null);
    const isInView = useInView(cardRef, { once: true, margin: "-100px" });

    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        whileHover={{
          scale: 1.05,
          y: -10,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
        className="feature-card"
      >
        <div className="w-lg h-96 p-8 text-center bg-white/10 backdrop-blur-xl  border-white/20 rounded-xl flex flex-col justify-between transition-all duration-300">

          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-16 h-16 bg-purple-100/30 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Icon className="w-8 h-8 text-purple-600" />
          </motion.div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen "
    >
      <div className="h-screen flex items-center justify-center relative overflow-hidden">

        {/* Soft Light Gradient Background */}
        <motion.div
          className="absolute inset-0"
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: "100% 50%" }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          style={{
            backgroundImage:
              "linear-gradient(135deg, #ECEAFF 10%, #FFFFFF 50%, #ECEAFF 100%)",
            backgroundSize: "200% 200%",
          }}
        />

        {/* Blobs - Soft Jelly Style */}
        <motion.div
          className="absolute w-96 h-96 bg-pink-200 opacity-50 rounded-full filter blur-3xl"
          style={{ borderRadius: "40% 60% 55% 45% / 50% 45% 55% 50%" }}
          animate={{
            x: [0, 50, -100, 0],
            y: [0, -40, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-[#FECDFF] opacity-40 rounded-full filter blur-3xl"
          style={{ borderRadius: "60% 40% 60% 40% / 50% 50% 50% 50%" }}
          animate={{
            x: [-80, 80, -80],
            y: [50, -50, 50],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />

        {/* Top Left Logo */}
        <div className="z-50">
          <div className=" top-6 left-6 z-50 flex items-center justify-center space-x-2 -translate-y-20">
            <Image src="/assets/logo.png" width={100} height={100} alt="Logo" />
            <p className="text-lg md:text-2xl font-bold text-gray-900 font-inter">Social Synk</p>
          </div>

          {/* Center Content */}
          <div className="z-10 text-center px-4 ">
            <h1 className="text-4xl md:text-7xl lg:text-9xl  mb-6 text-gray-900 font-inter leading-tight">
              Automate your email{" "}
              <span className="italic font-medium">campaigns</span>{" "}effortlessly.
            </h1>

            <p className="text-gray-700 mb-8 max-w-xl mx-auto text-base md:text-lg font-inter leading-relaxed">
              Supercharge your outreach with AI-powered email automation. Save time, boost engagement, and connect with your audience in just a few clicks.
            </p>

            <button className="bg-black text-white px-8 py-4 rounded-full hover:scale-105 transition transform hover:shadow-lg">
              Get Started for Free
            </button>
          </div>
        </div>

      </div>
      <motion.div
        ref={phoneRef}
        className="hero-phone floating-phone flex justify-center"
        initial={{ y: -100 }} // Same as -translate-y-[100px]
        whileHover={{ scale: 1.05, rotateY: 5 }}
        animate={{ y: [-100, -120, -100, -80, -100] }} // Animate around -100px position
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      >
        <Image src="/assets/PhoneImage.png" width={700} height={700} alt="Phone" />
      </motion.div>



      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-6 py-6"
      >
        <div className="flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-2"
          >
            <Image src="/assets/logo.png" width={50} height={50} alt="Logo" />
            <p className="text-lg md:text-2xl font-bold text-gray-900 font-inter">Social Synk</p>
          </motion.div>
        </div>
      </motion.header>

      <section
        ref={heroRef}
        className="container mx-auto px-6 pb-10 text-center flex flex-col items-center justify-center"
      >
        <motion.div style={{ y }} className="max-w-4xl mx-auto">

          <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl  text-gray-900 mb-8 leading-tight">
            Automate your{" "}
            <span className="italic font-medium text-purple-600">email campaigns</span>
            {" "}with ease.
          </h1>

          <p className="hero-subtitle text-base md:text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Boost your outreach with AI-powered email automation. Save time, drive engagement, and reach your audience with precision — all without manual effort.
          </p>

          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Button
              size="lg"
              className="bg-black hover:bg-gray-900 text-white px-10 py-4 text-lg rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              Start for Free Today
            </Button>
          </motion.div>

        </motion.div>
      </section>


      {/* Features Section */}
      <section
        ref={featuresRef}
        className="features-section container mx-auto px-6 py-24 mt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl  text-gray-900 mb-6">
            Everything You Need to Automate Your Emails
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            Supercharge your outreach with AI-powered tools designed to save time, increase engagement, and help your campaigns convert better.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <FeatureCard
            icon={Activity}
            title="Real-Time Analytics"
            description="Track opens, clicks, and performance with instant insights so you can optimize your email campaigns on the go."
            delay={0}
          />
          <FeatureCard
            icon={Clock}
            title="Scheduled Campaigns"
            description="Automate your email sending with precise scheduling, ensuring your messages land at the perfect moment."
            delay={0.2}
          />
          <FeatureCard
            icon={RotateCcw}
            title="Automated Follow-ups"
            description="Set up smart follow-up sequences based on recipient behavior, improving response rates without extra work."
            delay={0.4}
          />
          <FeatureCard
            icon={Zap}
            title="AI-Powered Personalization"
            description="Leverage AI to craft personalized emails that resonate with your audience, increasing engagement and conversions."
            delay={0.6}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="bg-black hover:bg-gray-900 text-white px-10 py-4 text-lg rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              See Our Pricing Plans
            </Button>
          </motion.div>
        </motion.div>
      </section>


      {/* Premium Section */}
      <section
        ref={premiumRef}
        className="premium-section container mx-auto px-6 py-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Premium Email Insights
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Unlock advanced features to track, analyze, and optimize your campaigns with SocialSynk Premium.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">

          {/* Premium Content */}
          <div className="premium-content space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                In-depth Email Analytics
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get detailed reports on open rates, click-through rates, and overall campaign performance to boost your email strategy.
              </p>
            </div>

            {/* Favorite Stats Card */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-4">
                Your Key Stats
              </h4>
              <div className="space-y-3">

                {/* Email Sent */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <img src="/assets/mail-sent.png" alt="Sent" className="w-8 h-8" />
                    <div>
                      <div className="font-medium text-gray-900">Emails Sent</div>
                      <div className="text-sm text-gray-500">12,450</div>
                    </div>
                  </div>
                </div>

                {/* Open Rate */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <img src="/assets/open-rate.png" alt="Open Rate" className="w-8 h-8" />
                    <div>
                      <div className="font-medium text-gray-900">Open Rate</div>
                      <div className="text-sm text-gray-500">42.7%</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Premium Visual Card */}
          <div className="premium-image">
            <motion.div
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold text-gray-900">Campaign Overview</h4>
                  <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Example Email Categories */}
                  <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl relative overflow-hidden flex items-center justify-center">
                    <div className="text-white text-sm font-medium">Transactional</div>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl relative overflow-hidden flex items-center justify-center">
                    <div className="text-white text-sm font-medium">Promotional</div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  Favorite Campaign Types
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">
                    Advanced Reports
                  </h4>
                  <p className="text-sm text-gray-600">
                    Track conversions, analyze email interactions, and optimize your campaigns using AI-driven suggestions.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Testimonial Section */}
      <section
        ref={testimonialRef}
        className="testimonial-section container mx-auto px-6 py-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="testimonial-content"
            >
              <div className="text-6xl text-purple-400 mb-6">"</div>

              <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 leading-relaxed mb-8">
                The easiest way to manage my{" "}
                <span className="text-purple-600">email campaigns</span> and track results effortlessly!
              </blockquote>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-600 font-bold">
                  S
                </div>
                <div>
                  <div className="font-medium text-gray-900">Emily Carter</div>
                  <div className="text-sm text-gray-500">Marketing Lead, TechStart</div>
                </div>
              </div>

            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              // whileHover={{ scale: 1.02, rotateY: -5 }}
              className="floating-phone"
            >
              <Image src="/assets/PhoneImage2.png" width={700} height={700} alt="Phone" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className=" mx-auto px-6 py-20 text-center bg-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Automate Emails — <span className="text-purple-600">3 Months Free!</span>
          </h2>

          <p className="text-lg text-gray-600 mb-12 leading-relaxed">
            Experience AI-powered email automation with SocialSynk. Effortlessly schedule, track, and boost your campaigns — no credit card required.
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              START FOR FREE TODAY
            </Button>
          </motion.div>
        </motion.div>
      </section>


      {/* Footer */}
      <footer className=" mx-auto px-6 py-12 border-t border-gray-200 bg-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          <div className="flex items-center justify-center space-x-2">
          <Image src="/assets/logo.png" width={50} height={50} alt="Logo" />
            <span className="text-xl font-bold text-gray-900">Social Synk</span>
          </div>

          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <a href="https://www.socialsynk.in/" className="hover:text-gray-900 transition-colors">
              SOCIAL SYNK
            </a>
            <a href="https://www.socialsynk.in/about" className="hover:text-gray-900 transition-colors">
              ABOUT US
            </a>
            <a href="https://www.socialsynk.in/contact" className="hover:text-gray-900 transition-colors">
              CONTACT
            </a>
          </div>

          <div className="flex justify-center space-x-6">
            <motion.a
              whileHover={{ scale: 1.2, rotate: 5 }}
              href="#"
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Facebook className="w-5 h-5 text-gray-600" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, rotate: -5 }}
              href="#"
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Instagram className="w-5 h-5 text-gray-600" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, rotate: 5 }}
              href="#"
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Twitter className="w-5 h-5 text-gray-600" />
            </motion.a>
          </div>

          <div className="text-xs text-gray-500 space-y-2">
            <p>© 2025 Social Synk. All Rights Reserved.</p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-700 transition-colors">
                Terms and Conditions
              </a>
            </div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
