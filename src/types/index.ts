export interface Batch {
  id: number | string;
  title: string;
  thumbnail: string;
  category?: string;
  classLevel?: string;
  description?: string;
  badge?: string;
  stream?: string;
  mrp?: string;
  offer_price?: string;
}

export interface ContentCount {
  folders?: { total: number; direct: number };
  video?: { free: number; paid: number };
  pdf?: { free: number; paid: number };
  test?: { free: number; paid: number };
  links?: { free: number; paid: number };
  notes?: { free: number; paid: number };
}

export interface FolderItem {
  type: 'folder' | 'file' | 'test';
  course_id: string | number;
  parent_id: string | number;
  entity_id: string;
  title: string;
  data: {
    id: number | string;
    title?: string;
    thumbnail?: string;
    file_url?: string;
    file_type?: number; // 1 = PDF, 2 = Video, 5 = Test
    video_type?: number;
    duration?: number | string;
    is_live?: number;
    created_at?: number | string;
    download_urls?: string;
    content_counts?: ContentCount;
    test_name?: string;
    total_time?: number | string;
    mark_per_question?: number | string;
    negative_marks?: number | string;
    vdc_id?: string | null;
  };
}

export interface CourseOverview {
  id: number | string;
  title: string;
  description?: string;
  thumbnail?: string;
  mrp?: string;
  offer_price?: string;
  is_new?: string;
  is_trending?: string;
  timeTableTitle?: string;
  timeTableHtml?: string;
}

export interface VideoMediaData {
  id: number | string;
  course_id?: number | string;
  title: string;
  description?: string;
  thumbnail?: string;
  file_url: string;
  file_type?: number;
  video_type?: number;
  duration?: number | string;
  is_live?: number;
  download_urls?: Array<{ title: string; url: string }> | string;
  drm_details?: any;
}

export interface LiveClassItem {
  id: number | string;
  video_id: number | string;
  title: string;
  thumbnail?: string;
  file_url?: string;
  duration?: string | number;
  live_status?: number | string;
  live_from?: number | string;
  live_to?: number | string;
  start_time?: number | string;
  created_at?: number | string;
  course_id?: number | string;
  description?: string | null;
  course?: {
    id?: number | string;
    title?: string;
  };
}

export interface TestQuestion {
  question_group_id: string | number;
  mark_per_question: number | string;
  negative_marks: number | string;
  languages: {
    english: {
      question_text: string;
      option_a: string;
      option_b: string;
      option_c: string;
      option_d: string;
      option_e?: string;
      solution?: string;
    };
  };
}
