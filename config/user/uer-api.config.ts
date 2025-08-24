import prisma from "@/lib/db";
import { User } from "@prisma/client";
export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}
// export const getUsers = async ({
//   page,
//   limit,
// }: {
//   page: number;
//   limit: number;
// }) => {
//   const startIndex = (page - 1) * limit;
//   const endIndex = startIndex + limit;

//   const paginatedData = usersData.slice(startIndex, endIndex);
//   const totalRecords = usersData.length;
//   const totalPages = Math.ceil(totalRecords / limit);

//   return {
//     status: "success",
//     message: "Successfully fetched data",
//     data: paginatedData,
//     pagination: {
//       totalRecords,
//       totalPages,
//       currentPage: page,
//       perPage: limit,
//       hasNextPage: endIndex < totalRecords,
//       hasPrevPage: startIndex > 0,
//     },
//   };
// };
