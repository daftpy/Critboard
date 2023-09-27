interface UploadResponse {
  type: "success" | "error";
  id?: string;
  upload?: {
    id: string;
    file_name: string;
    file_path: string;
    file_extension: string;
  };
  errors?: string[];
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  try {
    // Create a FormData object and append the file to it
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${import.meta.env.VITE_URL}/uploads`, {
      method: "POST",
      body: formData, // do not set headers here
    });

    const clonedResponse = response.clone();

    const rawResponse = await clonedResponse.text();
    console.log("Raw response: ", rawResponse);

    // Attempt to parse the JSON
    const data = await response.json();

    if (response.ok) {
      return {
        type: "success",
        upload: {
          id: data.id,
          file_path: data.file_path,
          file_name: data.file_name,
          file_extension: data.file_extension,
        },
      };
    } else {
      return {
        type: "error",
        errors: data.errors,
      };
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log("There was a problem: ", errorMessage);
    return { type: "error", errors: [errorMessage] };
  }
}
