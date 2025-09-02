export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get("reviewId");
  if (!reviewId) {
    return new Response("Missing reviewId", { status: 400 });
  }

  return new Response(JSON.stringify("review"), { status: 200 });
}
