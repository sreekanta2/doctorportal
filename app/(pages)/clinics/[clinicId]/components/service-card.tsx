"use client";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

// Icon mapping for common medical services
const serviceIcons: Record<string, string> = {
  cardiology: "mdi:heart-pulse",
  orthopedics: "mdi:bone",
  neurology: "mdi:brain",
  pediatrics: "mdi:stroller",
  dermatology: "mdi:skin",
  gastroenterology: "mdi:stomach",
  ophthalmology: "mdi:eye",
  dentistry: "mdi:tooth",
  radiology: "mdi:radiology-box",
  surgery: "mdi:scalpel",
  emergency: "mdi:ambulance",
  pharmacy: "mdi:pharmacy",
  therapy: "mdi:arm-flex",
  diagnostics: "mdi:microscope",
  wellness: "mdi:meditation",
  vaccination: "mdi:needle",
  women: "mdi:gender-female",
  men: "mdi:gender-male",
  geriatrics: "mdi:elderly",
};

// Fallback icon
const DEFAULT_ICON = "mdi:medical-bag";

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: string;
  delay?: number;
}

const ServiceCard = ({
  title,
  description,
  icon,
  delay = 0,
}: ServiceCardProps) => {
  // Find the best matching icon
  const findIcon = () => {
    if (icon) return icon;

    const lowerTitle = title.toLowerCase();
    for (const [key, value] of Object.entries(serviceIcons)) {
      if (lowerTitle.includes(key)) {
        return value;
      }
    }

    return DEFAULT_ICON;
  };

  const selectedIcon = findIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="group relative bg-card border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-transparent dark:from-primary-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5 flex items-start gap-4">
        <div className="flex-shrink-0 bg-primary-500/10 dark:bg-primary-900/30 group-hover:bg-primary-500/20 dark:group-hover:bg-primary-900/50 p-3 rounded-lg transition-colors duration-300">
          <Icon
            icon={selectedIcon}
            className="w-8 h-8 text-primary-600 dark:text-primary-400"
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
