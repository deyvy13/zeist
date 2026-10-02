// Client-side file download for the tools' exports (Excel, Word, DXF, CSV…).
export function downloadFile(name: string, type: string, data: string | Uint8Array) {
  const part: BlobPart = typeof data === "string" ? data : (data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer);
  const url = URL.createObjectURL(new Blob([part], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
