export interface Drama {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  coverUrl: string;
  genre: string[];
  rating: number;
  year: number;
  episodes: number;
  isVertical: boolean; // For short-drama format support
  trending?: boolean;
  isNew?: boolean;
  isVip?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Category {
  id: string;
  name: string;
  dramas: Drama[];
}