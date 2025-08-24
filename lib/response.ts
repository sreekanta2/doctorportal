// // lib/api-response.ts
// import { Prisma } from "@prisma/client";
// import { NextResponse } from "next/server";
// import { ZodError } from "zod";

// // -----------------------------
// // Type Definitions
// // -----------------------------

// type ErrorSource = {
//   path: string | number;
//   message: string;
// };

// type ErrorResponse = {
//   success: false;
//   statusCode: number;
//   message: string;
//   errors: ErrorSource[];
// };

// type PaginationMeta = {
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
//   hasNext: boolean;
//   hasPrev: boolean;
// };

// type SuccessMeta = {
//   message?: string;
//   pagination?: PaginationMeta;
//   [key: string]: unknown;
// };

// type SuccessResponse<T = unknown> = {
//   success: true;
//   statusCode: number;
//   message: string;
//   data: T;
//   meta?: SuccessMeta;
// };

// export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

// // -----------------------------
// // Error Classes
// // -----------------------------

// export class AppError extends Error {
//   constructor(
//     public message: string,
//     public statusCode: number = 500,
//     public errors: ErrorSource[] = [{ path: "", message }]
//   ) {
//     super(message);
//     Error.captureStackTrace(this, this.constructor);
//   }
// }

// // -----------------------------
// // Error Handlers
// // -----------------------------

// const handleZodError = (err: ZodError): ErrorResponse => ({
//   success: false,
//   statusCode: 400,
//   message: "Validation Error",
//   errors: err.issues.map((issue) => ({
//     path: issue.path.join("."),
//     message: issue.message,
//   })),
// });

// const handlePrismaError = (
//   err: Prisma.PrismaClientKnownRequestError
// ): ErrorResponse => {
//   const defaultResponse: ErrorResponse = {
//     success: false,
//     statusCode: 500,
//     message: "Database Error",
//     errors: [{ path: "database", message: err.message }],
//   };

//   switch (err.code) {
//     case "P2002":
//       return {
//         success: false,
//         statusCode: 409,
//         message: "Duplicate entry",
//         errors: [
//           {
//             path: err.meta?.target?.toString() || "field",
//             message: "This value already exists",
//           },
//         ],
//       };
//     case "P2025":
//       return {
//         success: false,
//         statusCode: 404,
//         message: "Not Found",
//         errors: [
//           {
//             path: err.meta?.modelName?.toString() || "resource",
//             message: "The requested resource was not found",
//           },
//         ],
//       };
//     default:
//       return defaultResponse;
//   }
// };

// export const globalErrorHandler = (err: unknown): ErrorResponse => {
//   if (process.env.NODE_ENV === "development") {
//     console.error("Error:", err);
//   }

//   if (err instanceof ZodError) return handleZodError(err);
//   if (err instanceof Prisma.PrismaClientKnownRequestError)
//     return handlePrismaError(err);
//   if (err instanceof AppError)
//     return {
//       success: false,
//       statusCode: err.statusCode,
//       message: err.message,
//       errors: err.errors,
//     };

//   return {
//     success: false,
//     statusCode: 500,
//     message: "Internal Server Error",
//     errors: [{ path: "server", message: "An unexpected error occurred" }],
//   };
// };

// // -----------------------------
// // Success Response Helpers
// // -----------------------------

// const createResponse = <T>(
//   data: T,
//   statusCode: number,
//   message: string,
//   meta?: SuccessMeta
// ): SuccessResponse<T> => ({
//   success: true,
//   statusCode,
//   message,
//   data,
//   ...(meta && { meta }),
// });

// export const createSuccessResponse = <T>(
//   data: T,
//   options?: { message?: string; meta?: Omit<SuccessMeta, "message"> }
// ) => {
//   const response = createResponse(
//     data,
//     201,
//     options?.message || "Resource created successfully",
//     options?.meta
//   );
//   return NextResponse.json(response, { status: 201 });
// };

// export const successResponse = <T>(
//   data: T,
//   options?: {
//     message?: string;
//     meta?: Omit<SuccessMeta, "message" | "pagination">;
//   }
// ) => {
//   const response = createResponse(
//     data,
//     200,
//     options?.message || "Request successful",
//     options?.meta
//   );
//   return NextResponse.json(response);
// };

// export const successPaginationResponse = <T>(
//   items: T[],
//   pagination: { total: number; page: number; limit: number },
//   options?: {
//     message?: string;
//     additionalMeta?: Omit<SuccessMeta, "pagination" | "message">;
//   }
// ) => {
//   const totalPages = Math.ceil(
//     pagination.total / Math.max(pagination.limit, 1)
//   );
//   const currentPage = Math.max(pagination.page, 1);

//   const response = createResponse(
//     items,
//     200,
//     options?.message || "Data retrieved successfully",
//     {
//       ...options?.additionalMeta,
//       pagination: {
//         total: pagination.total,
//         page: currentPage,
//         limit: pagination.limit,
//         totalPages,
//         hasNext: currentPage < totalPages,
//         hasPrev: currentPage > 1,
//       },
//     }
//   );

//   return NextResponse.json(response);
// };

// export const errorResponse = (err: unknown) => {
//   const result = globalErrorHandler(err);
//   return NextResponse.json(result, { status: result.statusCode });
// };
