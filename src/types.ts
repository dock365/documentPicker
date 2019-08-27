export enum Pages {
  library = "library",
  upload = "upload",
  url = "url",
}

export enum FileTypes {
  images = "images",
  videos = "videos",
  medias = "medias", // images, videos
  documents = "documents",
}

export const MS_BRAND_FILE_EXTENSIONS = ['accdb', 'csv', 'docx', 'dotx', 'mpt', 'odt', 'one', 'onepkg', 'onetoc', 'pptx', 'pub', 'vsdx', 'xls', 'xlsx', 'xsn'];
export const IMAGE_EXTENSIONS = ["jpeg", "jpg", "png", "gif", "tiff", "tif", "bmp"];
export const VIDEO_EXTENSIONS = ["mp4", "mov", "wmv", "flv", "avi", "3gp", "ogg", "vob", "mkv"];
export const MEDIA_EXTENSIONS = [...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS, "mp3"];
export const DOCUMENT_EXTENSIONS = [...MS_BRAND_FILE_EXTENSIONS, "pdf", "txt"];

export const extensions = {
  [FileTypes.documents]: DOCUMENT_EXTENSIONS,
  [FileTypes.images]: IMAGE_EXTENSIONS,
  [FileTypes.videos]: VIDEO_EXTENSIONS,
  [FileTypes.medias]: MEDIA_EXTENSIONS,
};