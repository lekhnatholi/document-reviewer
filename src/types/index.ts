export interface Position {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface FieldContent {
  confidence?: number;
  is_valid_format?: boolean;
  orig_value: string | number;
  page?: number;
  position?: number[]; // [x1, y1, x2, y2]
  position_label?: any[];
  review_required?: boolean;
  validation_source?: string;
  value: string | number;
}

export interface FieldItem {
  acc?: number;
  content: FieldContent;
  doc_id?: string;
  format?: string;
  format_message?: string;
  id: number;
  id_auto_extract?: number;
  id_auto_extract_label?: string;
  ignore?: boolean;
  label?: string;
  low_confidence?: boolean;
  no_items_row?: number;
  order?: number;
  org_id?: string;
  p_title?: string;
  p_type?: string;
  parent_id?: number;
  time_spent?: number;
  type?: string;
  user_id?: string;
  drop_down_type?: string;
  children?: LineItemChildren; // For line items
  row_count?: number;
  sub_p_id?: number;
  sub_p_title?: string;
  sub_p_type?: string;
}

// Handle the recursive structure for line items
export type LineItemChildren = FieldItem[][][] | FieldItem[];

export interface Section {
  children: FieldItem[];
  id: number;
  title: string;
  type: string;
}

export interface DocumentData {
  sections: Section[];
}

export interface ApiResponse {
  data: DocumentData;
}