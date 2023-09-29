export async function getUsers() {
  try {
    const response = await fetch(`${import.meta.env.VITE_URL}/users`, {
      method: "GET",
      headers: {},
      credentials: "include", // Ensure cookies are sent with the request
    });

    const clonedResponse = response.clone();

    const rawResponse = await clonedResponse.text();
    console.log("Raw response:", rawResponse);

    const data = await response.json();

    if (response.ok) {
      return { type: "success", user: data };
    } else {
      return { type: "error", errors: data.errors };
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log("There was a problem: ", errorMessage);
    return { type: "error", errors: [errorMessage] };
  }
}
