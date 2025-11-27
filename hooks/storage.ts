const storage = undefined;

export async function uploadImage(file: File, path = "products") {
  const res = await fetch(`/api/upload?path=${encodeURIComponent(path)}`, {
    method: "POST",
    headers: {
      "x-filename": file.name,
      "content-type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload failed: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  return data.url;
}

export default storage;
