export interface ResultDTO {
  isHtml?: boolean;
  title?: string;
  type: 'success' | 'error' | '';
  desc: string;
}

export interface GeneralDTO {
  id: number;
  name: string;
}
