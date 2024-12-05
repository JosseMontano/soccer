export const sendCloudinary = async (val : File, setProgress: (perc: number) => void) : Promise <string> => {
  const cloudName = "dimypug3k";
  const uploadPreset = "presets";

  return new Promise((resolve) => {
    const formData = new FormData();
    formData.append("file", val);
    formData.append("upload_preset", uploadPreset);

    const req = new XMLHttpRequest();
    req.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/upload`);
    req.upload.addEventListener('progress', (e) => {
      setProgress((e.loaded / e.total) * 100);
    });

    req.addEventListener('load', () => {
      const res = JSON.parse(req.response);
      setProgress(0);
      resolve(res.url);
    });

    req.send(formData);
  })
}