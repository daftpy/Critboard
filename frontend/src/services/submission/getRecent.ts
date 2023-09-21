export async function getRecent(count: number) {
  try {
    const response = await fetch(
      `http://localhost:3000/submissions/recent/${count}`,
    );

    const clonedResponse = response.clone();

    const rawResponse = await clonedResponse.text();
    console.log("Raw resopnse: ", rawResponse);

    const data = await response.json();

    if (response.ok) {
      return { type: "success", submissions: data };
    } else {
      return { type: "error", errors: data.errors };
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log("There was a problem: ", errorMessage);
    return { type: "error", errors: [errorMessage] };
  }
}
