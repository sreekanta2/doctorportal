// import { Prisma, PrismaClient, User } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function createUser(user: Omit<User, "id">): Promise<User> {
//   try {
//     const newUser = await prisma.user.create({
//       data: user,
//     });

//     return newUser;
//   } catch (error) {
//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       // P2002: Unique constraint violation (e.g., email or id already exists)
//       if (error.code === "P2002") {
//         const target = Array.isArray(error.meta?.target)
//           ? error.meta.target.join(", ")
//           : error.meta?.target;
//         console.error(
//           `Database Error: A user with the provided ${
//             target || "unique field(s)"
//           } already exists.`,
//           error.message
//         );
//         throw new Error(
//           `User creation failed: A user with this ${
//             target || "unique field(s)"
//           } already exists.`
//         );
//       }
//       // Handle other known Prisma errors if necessary
//       console.error(
//         `Prisma Known Error creating user (Code: ${error.code}):`,
//         error.message
//       );
//       throw new Error(`Database error creating user: ${error.code}`);
//     }
//     // Handle unexpected/unknown errors
//     console.error("Unknown Error creating user:", error);
//     throw new Error("An unexpected error occurred while creating the user.");
//   }
// }

// export async function updateUser(
//   id: string,
//   updates: Partial<User>
// ): Promise<User | null> {
//   try {
//     const updatedUser = await prisma.user.update({
//       where: { id },
//       data: updates,
//     });

//     return updatedUser;
//   } catch (error) {
//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       // P2025: Record to update not found
//       if (error.code === "P2025") {
//         console.warn(
//           `Database Warning: User with id '${id}' not found for update.`
//         );
//         return null; // Explicitly return null if no user was found to update
//       }
//       // P2002: Unique constraint violation (e.g., trying to update email to an existing one)
//       if (error.code === "P2002") {
//         const target = Array.isArray(error.meta?.target)
//           ? error.meta.target.join(", ")
//           : error.meta?.target;
//         console.error(
//           `Database Error: Update for user '${id}' would violate unique constraint on ${
//             target || "field(s)"
//           }.`,
//           error.message
//         );
//         throw new Error(
//           `User update failed: The update would result in a duplicate unique entry.`
//         );
//       }
//       console.error(
//         `Prisma Known Error updating user (Code: ${error.code}):`,
//         error.message
//       );
//       throw new Error(`Database error updating user: ${error.code}`);
//     }
//     // Handle unexpected/unknown errors
//     console.error("Unknown Error updating user:", error);
//     throw new Error("An unexpected error occurred while updating the user.");
//   }
// }

// export async function deleteUser(id: string): Promise<User | null> {
//   if (!id) {
//     console.error("No id provided for deletion.");
//     throw new Error("id is required for deletion.");
//   }
//   try {
//     const deletedUser = await prisma.user.delete({
//       where: { id },
//     });
//     return deletedUser;
//   } catch (error) {
//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       // P2025: Record to delete not found
//       if (error.code === "P2025") {
//         console.warn(
//           `Database Warning: User with id '${id}' not found for deletion.`
//         );
//         return null; // Explicitly return null if no user was found to delete
//       }
//       console.error(
//         `Prisma Known Error deleting user (Code: ${error.code}):`,
//         error.message
//       );
//       throw new Error(`Database error deleting user: ${error.code}`);
//     }
//     // Handle unexpected/unknown errors
//     console.error("Unknown Error deleting user:", error);
//     throw new Error("An unexpected error occurred while deleting the user.");
//   }
// }
