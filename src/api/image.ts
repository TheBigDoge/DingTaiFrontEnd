export type Media =
  | {
      type: 'image';
      image: Image;
      video?: never;
    }
  | {
      type: 'video';
      image?: never;
      video: Video;
    };

export interface Image {
  content_type: string;
  url: string;
}

export interface Video {
  content_type: string;
  url: string;
}
