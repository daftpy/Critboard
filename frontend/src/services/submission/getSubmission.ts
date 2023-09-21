export async function getSubmission(commentId: string) {
    try {
        const response = await fetch(
            `http://localhost:3000/submissions/${commentId}`,
        );

        const clonedResponse = response.clone();

        const rawResponse = await clonedResponse.text();
        console.log("Raw resopnse: ", rawResponse);

        const data = await response.json();

        if (response.ok) {
            return {
                type: "success",
                submission: data.submission,
                feedback: data.feedback,
            };
        } else {
            return { type: "error", errors: data.errors };
        }
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.log("There was a problem: ", errorMessage);
        return { type: "error", errors: [errorMessage] };
    }
}
