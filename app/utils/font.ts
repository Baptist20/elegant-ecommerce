import { Poppins } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import { Inter } from "next/font/google";

export const poppins = Poppins({ subsets: ["latin"], weight: "500" });
export const space_Grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: "500",
});
export const inter = Inter({ weight: "500", subsets: ["latin"] });
