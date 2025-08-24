"use client";

import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface HeroProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  backgroundImage?: string;
  overlay?: boolean;
  overlayGradient?: string;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
}

export const Hero = ({
  title,
  subtitle,
  breadcrumbs = [],
  backgroundImage = "https://dashboi-one.vercel.app/images/home/hero-bg.png",

  contentClassName = "",
  titleClassName = "",
}: HeroProps) => {
  const session = true;
  return (
    <section className="relative bg-cover bg-center bg-no-repeat overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : undefined,
        }}
      />

      <div
        className={cn(
          "w-full h-full absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"
        )}
      />
      <div className="container relative z-10">
        <div className="w-full h-64 md:h-80 pb-10 flex items-end justify-center">
          <div
            className={cn(
              "flex justify-center flex-col items-center text-center mb-8",
              contentClassName
            )}
          >
            <h1
              className={cn(
                "  text-xl md:text-2xl xl:text-4xl xl:leading-[52px] font-semibold text-default-900",
                titleClassName
              )}
            >
              {title}
            </h1>

            {subtitle && (
              <p className="mt-4 text-default-600 max-w-[500px]">{subtitle}</p>
            )}

            {breadcrumbs.length > 0 && (
              <Breadcrumbs className="mt-4">
                {breadcrumbs.map((item, index) => (
                  <BreadcrumbItem key={index}>
                    {item.href ? (
                      <Link href={item.href}>{item.label}</Link>
                    ) : (
                      item.label
                    )}
                  </BreadcrumbItem>
                ))}
              </Breadcrumbs>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
