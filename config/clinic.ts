import { clinicDemoData, clinicsDemoData } from "@/app/(pages)/clinics/data";

export const getClinics = async ({
  page,
  limit,
  filter,
}: {
  page: number;
  limit: number;
  filter?: {
    name: string;
    gender: string;
    language: string;
    specialty: string;
  };
}) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedData = clinicsDemoData.slice(startIndex, endIndex);
  const totalRecords = clinicsDemoData.length;
  const totalPages = Math.ceil(totalRecords / limit);

  return {
    status: "success",
    message: "Successfully fetched data",
    data: paginatedData,
    pagination: {
      totalRecords,
      totalPages,
      currentPage: page,
      perPage: limit,
      hasNextPage: endIndex < totalRecords,
      hasPrevPage: startIndex > 0,
    },
  };
};
export const getClinic = async (page: number, limit: number) => {
  // Pagination parameters

  // Paginate reviews
  const totalReviews = clinicDemoData.reviews.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReviews = clinicDemoData.reviews.slice(startIndex, endIndex);

  return {
    status: "success",
    message: "Doctor data fetched successfully",
    data: {
      ...clinicDemoData, // Spread full doctor data
      reviews: paginatedReviews, // Replace reviews with paginated ones
    },
    pagination: {
      totalRecords: totalReviews,
      totalPages: Math.ceil(totalReviews / limit),
      currentPage: page,
      perPage: limit,
      hasNextPage: endIndex < totalReviews,
      hasPrevPage: startIndex > 0,
    },
  };
};
