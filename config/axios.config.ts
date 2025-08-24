import axios from "axios";

// Safely set the baseURL with a fallback
const baseURL = process.env.NEXTAUTH_URL
  ? `${process.env.NEXTAUTH_URL}/api`
  : "http://localhost:3000/api";

export const api = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${session?.user?.accessToken}`,
  },
});
