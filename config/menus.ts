import {
  Building2,
  Calendar,
  CreditCard,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Share2,
  Star,
  Stethoscope,
  User,
  UserPlus,
  Users,
} from "lucide-react";

export const menus: MenuItemProps[] = [
  {
    title: "Doctors",
    href: "/doctors",
  },
  {
    title: "Clinics",
    href: "/clinics",
  },

  {
    title: "About",
    href: "/about",
  },
];

export interface MenuItemProps {
  title?: string;
  icon?: React.ElementType;
  href?: string;
  child?: MenuItemProps[];
  megaMenu?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick?: () => void;
  isHeader?: boolean;
}

// specific configuration
export const doctorConfig: MenuItemProps[] = [
  {
    title: "Profile",
    href: "profile",
    icon: User,
  },
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "dashboard",
  },
  {
    title: "My Patients",
    href: "patients",
    icon: Users,
  },

  {
    title: "Schedule",
    href: "schedule",
    icon: Calendar,
  },
  {
    title: "Reviews",
    href: "reviews",
    icon: Star,
  },

  // {
  //   title: "Invoices",
  //   href: "/invoices",
  //   icon: FileText,
  //   child: [
  //     {
  //       title: "Create Invoice",
  //       href: "/create-invoice",
  //       icon: DollarSign,
  //     },

  //     {
  //       title: " Invoices List",
  //       href: "/invoice-list",
  //       icon: Heart,
  //     },
  //   ],
  // },

  // {
  //   title: "Settings",
  //   href: "settings",
  //   icon: Settings,
  // },

  {
    title: "Social Media",
    href: "socials",
    icon: Share2,
  },
];

// specific configuration
export const patientConfig: MenuItemProps[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "dashboard",
  },
  {
    title: "Profile",
    href: "profile",
    icon: User,
  },
];
export const clinicConfig: MenuItemProps[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "dashboard",
  },
  {
    title: "Profile",
    href: "profile",
    icon: User,
  },
];
export const adminConfig: MenuItemProps[] = [
  // Dashboard section
  {
    isHeader: true,
    title: "Admin Dashboard",
  },
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "dashboard",
  },
  {
    title: "Doctors",
    href: "doctors",
    icon: Stethoscope, // better than UserPlus
  },
  {
    title: "Clinics",
    href: "clinics",
    icon: Building2, // building icon for clinics
  },
  {
    title: "Patients",
    href: "patients",
    icon: Users, // group of users
  },
  {
    title: "Subscriptions",
    href: "subscriptions",
    icon: CreditCard, // payment/subscription
  },
  {
    title: "Doctor Reviews",
    href: "reviews",
    icon: Star, // reviews/rating
  },
  {
    title: "Clinic Reviews",
    href: "clinic-review",
    icon: MessageSquare, // feedback/comments
  },
  {
    title: "Specialties",
    href: "specialties",
    icon: UserPlus, // could also use ClipboardList if more relevant
  },
  {
    title: "Cities",
    href: "cities",
    icon: MapPin, // location/city
  },
];
// export const pharmacyConfig: MenuItemProps[] = [
//   {
//     isHeader: true,
//     title: "Menu",
//   },

//   {
//     title: "Dashboard",
//     icon: LayoutDashboard,
//     href: "dashboard",
//   },

//   {
//     title: "Products",
//     href: "products",
//     icon: CalendarDays,
//     child: [
//       {
//         title: "Products ",
//         href: "products",
//         icon: Heart,
//         // multi_menu: [
//         //   {
//         //     title: "Active Products",
//         //     href: "active-products",
//         //     icon: Heart,
//         //   },
//         //   {
//         //     title: "Inactive Products",
//         //     href: "inactive-products",
//         //     icon: Heart,
//         //   },
//         // ],
//       },
//       {
//         title: "Add Product",
//         href: "add-product",
//         icon: DollarSign,
//       },
//       {
//         title: "Out of Stock",
//         href: "out-of-stock",
//         icon: DollarSign,
//       },
//       {
//         title: "Expired",
//         href: "expired",
//         icon: DollarSign,
//       },
//     ],
//   },
//   {
//     title: "Categories",
//     href: "categories",
//     icon: Users,
//   },
//   {
//     title: "Orders",
//     href: "orders",
//     icon: Heart,
//   },

//   {
//     title: "Transactions",
//     href: "transactions",
//     icon: CreditCard,
//   },
//   {
//     title: "Settings",
//     href: "settings",
//     icon: User,
//   },

//   {
//     title: "Change Password",
//     href: "change-password",
//     icon: Lock,
//   },
// ];
