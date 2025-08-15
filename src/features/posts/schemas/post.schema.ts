export type SimplePost = {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  isAnonymous: boolean;
  authorName: string | null;
  user: {
    id: string;
    name: string;
  } | null;
  likes: {
    userId: string;
  }[];
  _count: {
    comments: number;
  };
};

export interface PostFormProps {
  showCard?: boolean;
  placeholder?: string;
  className?: string;
  forumId?: string;
}

export interface PostReportProps {
  postId: string;
  onPostDeleted?: () => void;
}