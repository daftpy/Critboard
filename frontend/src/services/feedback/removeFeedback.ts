export async function removeFeedback(commentId:string) {
    try {
        const response = await fetch(`http://localhost:3000/feedback/${commentId}/remove`, {
          method: "PATCH",  // Using PATCH method for soft-delete
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentId })  // Only sending the commentId, adjust if more data is required
        });
    
        const clonedResponse = response.clone();
    
        const rawResponse = await clonedResponse.text();
        console.log("Raw response: ", rawResponse);
    
        const data = await response.json();
    
        if (response.ok) {
          return {
            type: "success", message: data.message, feedback: data.feedback
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