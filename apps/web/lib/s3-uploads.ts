import api from "@/lib/axios.client";

export const uploadToS3 = async (
  file: File,
  folder: string
): Promise<string> => {

  const res = await api.post("/media/upload-url", {
    fileName: file.name,
    fileType: file.type,
    folder
  });

  const { uploadUrl, fileUrl } = res.data.data;

  await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type
    },
    body: file
  });

  return fileUrl;
};